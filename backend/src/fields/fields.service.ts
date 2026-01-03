import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FieldCategory, ChatVisibility } from '@prisma/client';

@Injectable()
export class FieldsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; description?: string; teamId: string; category?: FieldCategory }) {
        // Create field
        const field = await this.prisma.field.create({ data });

        // Auto-create chat room for this field
        await this.prisma.chat.create({
            data: {
                name: `${field.name} Chat`,
                isGroup: true,
                visibility: ChatVisibility.MEMBERS_ONLY,
                fieldId: field.id
            }
        });

        return field;
    }

    async findAll() {
        return this.prisma.field.findMany({
            include: {
                team: { select: { id: true, name: true } },
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findByCategory(category: FieldCategory) {
        return this.prisma.field.findMany({
            where: { category },
            include: {
                team: { select: { id: true, name: true } },
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findByTeam(teamId: string) {
        return this.prisma.field.findMany({
            where: { teamId },
            include: {
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findOne(id: string) {
        const field = await this.prisma.field.findUnique({
            where: { id },
            include: {
                team: true,
                members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } },
                classes: true,
                chats: true,
                meetings: true,
            },
        });
        if (!field) throw new NotFoundException('Field not found');
        return field;
    }

    async update(id: string, data: { name?: string; description?: string; category?: FieldCategory }) {
        return this.prisma.field.update({ where: { id }, data });
    }

    async delete(id: string) {
        // Also delete related chats
        await this.prisma.chat.deleteMany({ where: { fieldId: id } });
        await this.prisma.fieldMember.deleteMany({ where: { fieldId: id } });
        return this.prisma.field.delete({ where: { id } });
    }

    async addMember(fieldId: string, userId: string) {
        return this.prisma.fieldMember.create({
            data: { fieldId, userId },
        });
    }

    async removeMember(fieldId: string, userId: string) {
        return this.prisma.fieldMember.deleteMany({
            where: { fieldId, userId },
        });
    }

    async getFieldMembers(fieldId: string) {
        return this.prisma.fieldMember.findMany({
            where: { fieldId },
            include: { user: true },
        });
    }

    async getAggregatedAttendance(fieldId: string) {
        const field = await this.prisma.field.findUnique({
            where: { id: fieldId },
            include: {
                classes: { select: { id: true } },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!field) throw new NotFoundException('Field not found');

        const totalClasses = field.classes.length;
        const classIds = field.classes.map(c => c.id);
        const threshold = field.attendanceThreshold;

        // Fetch all attendance records for these classes
        const allAttendance = await this.prisma.attendance.findMany({
            where: { classId: { in: classIds } }
        });

        const membersStats = field.members.map(member => {
            const user = member.user;
            const userAttendance = allAttendance.filter(a => a.userId === user.id);

            // Present or Late counts as attended
            const attendedCount = userAttendance.filter(a =>
                a.status === 'PRESENT' || a.status === 'LATE'
            ).length;

            const percentage = totalClasses > 0
                ? Math.round((attendedCount / totalClasses) * 100)
                : 100;

            return {
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                attendedCount,
                totalClasses,
                attendancePercentage: percentage,
                isEligible: percentage >= threshold
            };
        });

        return {
            fieldId,
            fieldName: field.name,
            threshold,
            members: membersStats
        };
    }

    async updateThreshold(fieldId: string, threshold: number) {
        return this.prisma.field.update({
            where: { id: fieldId },
            data: { attendanceThreshold: threshold }
        });
    }
}

