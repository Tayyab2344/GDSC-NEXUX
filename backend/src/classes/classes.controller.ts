import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, Req } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { AttendanceStatus } from '@prisma/client';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body()
        data: {
            title: string;
            description?: string;
            scheduledAt: string;
            durationMin?: number;
            fieldId: string;
            meetingUrl?: string;
            resources?: string;
        },
        @Req() req: any,
    ) {
        return this.classesService.create({
            ...data,
            scheduledAt: new Date(data.scheduledAt),
            instructorId: req.user.id,
        });
    }

    @Get()
    async findAll(@Query('fieldId') fieldId?: string) {
        if (fieldId) {
            return this.classesService.findByField(fieldId);
        }
        return this.classesService.findAll();
    }

    @Get('upcoming')
    async findUpcoming() {
        return this.classesService.findUpcoming();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.classesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
        return this.classesService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.classesService.delete(id);
    }

    // ==================
    // ATTENDANCE ENDPOINTS
    // ==================

    // Join class - records entry time
    @UseGuards(JwtAuthGuard)
    @Post(':id/join')
    async joinClass(@Param('id') classId: string, @Req() req: any) {
        return this.classesService.joinClass(classId, req.user.id);
    }

    // Heartbeat - called every 30 seconds to track presence
    @UseGuards(JwtAuthGuard)
    @Post(':id/heartbeat')
    async heartbeat(@Param('id') classId: string, @Req() req: any) {
        return this.classesService.heartbeat(classId, req.user.id);
    }

    // Leave class - records exit time and calculates final attendance
    @UseGuards(JwtAuthGuard)
    @Post(':id/leave')
    async leaveClass(@Param('id') classId: string, @Req() req: any) {
        return this.classesService.leaveClass(classId, req.user.id);
    }

    // Get my attendance for a class
    @UseGuards(JwtAuthGuard)
    @Get(':id/my-attendance')
    async getMyAttendance(@Param('id') classId: string, @Req() req: any) {
        return this.classesService.getMyAttendance(classId, req.user.id);
    }

    // Get class attendance (for instructor)
    @UseGuards(JwtAuthGuard)
    @Get(':id/attendance')
    async getClassAttendance(@Param('id') classId: string) {
        return this.classesService.getClassAttendance(classId);
    }

    // Get user's overall attendance history
    @UseGuards(JwtAuthGuard)
    @Get('user/:userId/attendance')
    async getUserAttendance(@Param('userId') userId: string) {
        return this.classesService.getUserAttendance(userId);
    }

    // Manual attendance marking by instructor
    @UseGuards(JwtAuthGuard)
    @Post(':id/mark-attendance')
    async markAttendance(
        @Param('id') classId: string,
        @Body() data: { userId: string; status: AttendanceStatus },
    ) {
        return this.classesService.markAttendance(classId, data.userId, data.status);
    }
}
