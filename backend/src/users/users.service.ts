import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    async updateProfile(userId: string, data: { fullName?: string; email?: string; password?: string }) {
        if (data.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: data.email,
                    id: { not: userId }
                }
            });
            if (existingUser) {
                throw new BadRequestException('Email is already in use by another account.');
            }
        }

        const updateData: any = {};
        if (data.fullName) updateData.fullName = data.fullName;
        if (data.email) updateData.email = data.email;

        if (data.password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(data.password, salt);
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
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
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const totalUsers = await this.prisma.user.count();
        const activeTeams = await this.prisma.field.count();
        const eventsThisMonth = await this.prisma.event.count({
            where: {
                date: { gte: startOfMonth }
            }
        });
        const messagesToday = await this.prisma.chatMessage.count({
            where: {
                createdAt: { gte: startOfToday }
            }
        });

        // Member growth over 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const growth = await this.prisma.user.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: { createdAt: { gte: sixMonthsAgo } },
        });

        // Field distribution
        const fieldDist = await this.prisma.field.findMany({
            include: { _count: { select: { members: true } } }
        });

        // Attendance trends (simplified)
        const attendanceTrends = await this.prisma.attendance.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: { createdAt: { gte: sixMonthsAgo } }
        });

        return {
            totalUsers,
            activeTeams,
            eventsThisMonth,
            messagesToday,
            summary: { totalUsers, activeFields: activeTeams, totalEvents: eventsThisMonth },
            growth: growth.map(g => ({ date: g.createdAt, count: g._count.id })),
            fieldDistribution: fieldDist.map(f => ({ name: f.name, value: f._count.members })),
            attendance: attendanceTrends.map(a => ({ date: a.createdAt, count: a._count.id }))
        };
    }

    async getLeadStats(fieldId: string) {
        const field: any = await this.prisma.field.findUnique({
            where: { id: fieldId },
            include: {
                members: {
                    include: { user: true },
                    take: 10,
                    orderBy: { user: { xp: 'desc' } }
                }
            }
        });

        if (!field) throw new NotFoundException('Field not found');

        const memberCount = await this.prisma.fieldMember.count({ where: { fieldId } });
        const quizCount = await this.prisma.quiz.count({ where: { fieldId } });
        const resourceCount = await this.prisma.learningResource.count({ where: { fieldId } });

        return {
            stats: {
                members: memberCount,
                quizzes: quizCount,
                resources: resourceCount
            },
            topMembers: field.members.map((m: any) => m.user),
            engagement: []
        }
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

    async addUserToField(userId: string, fieldId: string) {
        const field = await this.prisma.field.findUnique({
            where: { id: fieldId },
            include: { team: true }
        });
        if (!field) throw new NotFoundException('Field not found');

        const existingTeamMember = await this.prisma.teamMember.findUnique({
            where: { userId_teamId: { userId, teamId: field.teamId } }
        });
        if (!existingTeamMember) {
            await this.prisma.teamMember.create({
                data: { userId, teamId: field.teamId, role: Role.TEAM_MEMBER }
            });
        }

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

    async updateResetToken(userId: string, token: string, expiry: Date) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { resetToken: token, resetTokenExpiry: expiry }
        });
    }

    async findByResetToken(token: string) {
        return this.prisma.user.findFirst({
            where: { resetToken: token }
        });
    }

    async updatePassword(userId: string, hash: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: hash, resetToken: null, resetTokenExpiry: null }
        });
    }
}
