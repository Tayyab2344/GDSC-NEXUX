import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByGoogleIdOrCreate(profile: any) {
        const { email, googleId, firstName, lastName, picture } = profile;
        return this.prisma.user.upsert({
            where: { email },
            update: { googleId, avatarUrl: picture },
            create: {
                email,
                googleId,
                fullName: `${firstName} ${lastName}`,
                avatarUrl: picture,
                role: Role.GENERAL_MEMBER,
                status: UserStatus.AUTHENTICATED,
            },
        });
    }

    async create(userData: any) {
        return this.prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                fullName: `${userData.firstName} ${userData.lastName}`,
                role: Role.GENERAL_MEMBER,
                status: UserStatus.AUTHENTICATED,
            },
        });
    }

    async getDashboardData(userId: string, includeFields: boolean = false) {
        const include: any = {
            teams: {
                include: {
                    team: true
                }
            },
            attendance: {
                include: {
                    class: true,
                    meeting: true
                }
            },
            _count: {
                select: {
                    attendance: true,
                    submissions: true,
                }
            }
        };

        if (includeFields) {
            include.fields = {
                include: {
                    field: {
                        include: {
                            chats: true,
                            classes: {
                                where: {
                                    scheduledAt: { gte: new Date() }
                                },
                                take: 5,
                                orderBy: { scheduledAt: 'asc' }
                            },
                            resources: {
                                take: 5,
                                orderBy: { createdAt: 'desc' }
                            }
                        }
                    }
                }
            };
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include
        });

        if (!user) throw new NotFoundException('User not found');

        // Calculate XP based on attendance and other factors
        const attendanceCount = (user as any)._count?.attendance || 0;
        const xp = attendanceCount * 50 + 100; // Base 100 + 50 per attendance

        return {
            ...user,
            stats: {
                events: attendanceCount,
                courses: user.fields?.length || 0,
                certificates: 0,
                xp: xp
            }
        };
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findByIdentifier(identifier: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { regNo: identifier },
                    { membershipId: identifier }
                ]
            }
        });
    }

    async findAll(search?: string, status?: UserStatus) {
        const where: any = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.user.findMany({
            where,
            include: {
                fields: {
                    include: {
                        field: true
                    }
                },
                teams: {
                    include: {
                        team: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAdminStats() {
        const totalUsers = await this.prisma.user.count();
        const activeTeams = await this.prisma.team.count(); // actually fields often represent teams in this context
        const eventsThisMonth = await this.prisma.event.count(); // Assuming Event model exists and populated or 0
        const messagesToday = await this.prisma.chatMessage.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        return {
            totalUsers,
            activeTeams,
            eventsThisMonth,
            messagesToday
        };
    }

    async updateRole(userId: string, role: Role) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }

    async updateStatus(userId: string, status: UserStatus) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status },
        });
    }

    async getMembers() {
        return this.prisma.user.findMany({
            where: { status: UserStatus.MEMBER },
        });
    }

    async getApplicants() {
        return this.prisma.user.findMany({
            where: { status: UserStatus.APPLICANT },
        });
    }

    /**
     * Generate a simple, easy-to-remember membership ID
     * Format: 001, 002, 003, ...
     */
    async generateMembershipId(): Promise<string> {
        const lastMember = await this.prisma.user.findFirst({
            where: { membershipId: { not: null } },
            orderBy: { membershipId: 'desc' },
            select: { membershipId: true }
        });

        if (!lastMember?.membershipId) {
            return '001';
        }

        const lastNum = parseInt(lastMember.membershipId, 10);
        const nextNum = lastNum + 1;
        return nextNum.toString().padStart(3, '0');
    }

    /**
     * Assign a new membership ID to a user and update their status to MEMBER
     */
    async assignMembershipId(userId: string): Promise<string> {
        const membershipId = await this.generateMembershipId();
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                membershipId,
                status: UserStatus.MEMBER,
                role: Role.TEAM_MEMBER
            }
        });
        return membershipId;
    }

    /**
     * Add user to a field (and its team) as a member
     */
    async addUserToField(userId: string, fieldId: string) {
        const field = await this.prisma.field.findUnique({
            where: { id: fieldId },
            include: { team: true }
        });
        if (!field) throw new NotFoundException('Field not found');

        // Add to team if not already
        const existingTeamMember = await this.prisma.teamMember.findUnique({
            where: { userId_teamId: { userId, teamId: field.teamId } }
        });
        if (!existingTeamMember) {
            await this.prisma.teamMember.create({
                data: { userId, teamId: field.teamId, role: Role.TEAM_MEMBER }
            });
        }

        // Add to field if not already
        const existingFieldMember = await this.prisma.fieldMember.findUnique({
            where: { userId_fieldId: { userId, fieldId } }
        });
        if (!existingFieldMember) {
            await this.prisma.fieldMember.create({
                data: { userId, fieldId }
            });
        }

        return { teamId: field.teamId, fieldId };
    }
}
