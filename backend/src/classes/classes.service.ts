import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        title: string;
        description?: string;
        scheduledAt: Date;
        durationMin?: number;
        fieldId: string;
        instructorId: string;
        meetingUrl?: string;
        resources?: string;
    }) {
        let meetingUrl = data.meetingUrl;
        if (!meetingUrl) {
            // Generate Jitsi Meet URL
            const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const randomId = Math.random().toString(36).substring(2, 8);
            meetingUrl = `https://meet.jit.si/GDSC-Nexus-${slug}-${randomId}`;
        }

        return this.prisma.class.create({
            data: {
                ...data,
                meetingUrl
            }
        });
    }

    async findAll() {
        return this.prisma.class.findMany({
            include: {
                field: { select: { id: true, name: true, teamId: true } },
                instructor: { select: { id: true, fullName: true, avatarUrl: true } },
                _count: { select: { attendance: true } },
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }

    async findByField(fieldId: string) {
        return this.prisma.class.findMany({
            where: { fieldId },
            include: {
                instructor: { select: { id: true, fullName: true, avatarUrl: true } },
                _count: { select: { attendance: true } },
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }

    async findUpcoming() {
        return this.prisma.class.findMany({
            where: { scheduledAt: { gte: new Date() } },
            include: {
                field: { select: { id: true, name: true } },
                instructor: { select: { id: true, fullName: true } },
            },
            orderBy: { scheduledAt: 'asc' },
            take: 10,
        });
    }

    async findOne(id: string) {
        const cls = await this.prisma.class.findUnique({
            where: { id },
            include: {
                field: true,
                instructor: true,
                attendance: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true, email: true } } },
                },
            },
        });
        if (!cls) throw new NotFoundException('Class not found');
        return cls;
    }

    async update(
        id: string,
        data: Partial<{
            title: string;
            description: string;
            scheduledAt: Date;
            durationMin: number;
            meetingUrl: string;
            resources: string;
        }>,
    ) {
        return this.prisma.class.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.class.delete({ where: { id } });
    }

    // ===================
    // ATTENDANCE TRACKING
    // ===================

    // Join class - creates attendance record
    async joinClass(classId: string, userId: string) {
        // Check if already joined
        const existing = await this.prisma.attendance.findFirst({
            where: { classId, userId, leftAt: null },
        });

        if (existing) {
            return existing; // Already in class
        }

        // Get class details for late detection
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls) throw new NotFoundException('Class not found');

        const now = new Date();
        const classStart = new Date(cls.scheduledAt);
        const lateThreshold = 10; // minutes
        const isLate = now.getTime() > classStart.getTime() + lateThreshold * 60 * 1000;

        return this.prisma.attendance.create({
            data: {
                classId,
                userId,
                status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
                joinedAt: now,
                lastHeartbeat: now,
                totalMinutesPresent: 0,
            },
        });
    }

    // Heartbeat - called every 30 seconds to track presence
    async heartbeat(classId: string, userId: string) {
        const attendance = await this.prisma.attendance.findFirst({
            where: { classId, userId, leftAt: null },
        });

        if (!attendance) {
            throw new BadRequestException('Not in class. Please join first.');
        }

        const now = new Date();
        const lastBeat = new Date(attendance.lastHeartbeat || attendance.joinedAt || now);
        const minutesSinceLastBeat = (now.getTime() - lastBeat.getTime()) / 60000;

        // Only count if heartbeat is within reasonable time (< 2 minutes)
        const validMinutes = minutesSinceLastBeat < 2 ? minutesSinceLastBeat : 0;

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                lastHeartbeat: now,
                totalMinutesPresent: attendance.totalMinutesPresent + validMinutes,
            },
        });
    }

    // Leave class - marks departure and calculates final status
    async leaveClass(classId: string, userId: string) {
        const attendance = await this.prisma.attendance.findFirst({
            where: { classId, userId, leftAt: null },
        });

        if (!attendance) {
            throw new BadRequestException('Not in class');
        }

        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls) throw new NotFoundException('Class not found');

        const now = new Date();
        const totalDuration = cls.durationMin || 60; // default 60 min
        const lastBeat = new Date(attendance.lastHeartbeat || attendance.joinedAt || now);
        const finalMinutes = attendance.totalMinutesPresent + (now.getTime() - lastBeat.getTime()) / 60000;
        const attendancePercentage = (finalMinutes / totalDuration) * 100;

        // Determine final status
        let finalStatus: AttendanceStatus = AttendanceStatus.PRESENT;
        if (attendancePercentage < 30) {
            finalStatus = AttendanceStatus.ABSENT; // Less than 30% = absent
        } else if (attendancePercentage < 80) {
            finalStatus = AttendanceStatus.EXCUSED; // 30-80% = partial (using EXCUSED as LEFT_EARLY)
        } else if (attendance.status === AttendanceStatus.LATE) {
            finalStatus = AttendanceStatus.LATE; // Keep late status
        }

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                leftAt: now,
                totalMinutesPresent: Math.round(finalMinutes),
                attendancePercentage: Math.round(attendancePercentage),
                status: finalStatus,
            },
        });
    }

    // Get attendance status for a user in a class
    async getMyAttendance(classId: string, userId: string) {
        return this.prisma.attendance.findFirst({
            where: { classId, userId },
            include: { class: true },
        });
    }

    // Get class attendance with percentages (for instructor)
    async getClassAttendance(classId: string) {
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls) throw new NotFoundException('Class not found');

        const attendance = await this.prisma.attendance.findMany({
            where: { classId },
            include: { user: { select: { id: true, fullName: true, email: true, avatarUrl: true } } },
            orderBy: { joinedAt: 'asc' },
        });

        return {
            class: cls,
            totalDuration: cls.durationMin || 60,
            attendance: attendance.map((a) => ({
                ...a,
                isActive: !a.leftAt,
                percentageAttended: a.attendancePercentage || 0,
            })),
            summary: {
                total: attendance.length,
                present: attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length,
                late: attendance.filter((a) => a.status === AttendanceStatus.LATE).length,
                partial: attendance.filter((a) => a.status === AttendanceStatus.EXCUSED).length,
                absent: attendance.filter((a) => a.status === AttendanceStatus.ABSENT).length,
            },
        };
    }

    async getUserAttendance(userId: string) {
        return this.prisma.attendance.findMany({
            where: { userId },
            include: { class: true, meeting: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Manual attendance marking by instructor
    async markAttendance(classId: string, userId: string, status: AttendanceStatus) {
        const existing = await this.prisma.attendance.findFirst({
            where: { classId, userId },
        });

        if (existing) {
            return this.prisma.attendance.update({
                where: { id: existing.id },
                data: { status },
            });
        }

        return this.prisma.attendance.create({
            data: {
                classId,
                userId,
                status,
                joinedAt: new Date(),
            },
        });
    }
}
