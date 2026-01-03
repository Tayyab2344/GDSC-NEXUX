import { Controller, Get, Put, Delete, Param, UseGuards, Req, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getNotifications(@Req() req: any) {
        return this.notificationsService.getNotifications(req.user.id);
    }

    @Put('mark-all-read')
    async markAllAsRead(@Req() req: any) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }

    @Put(':id/read')
    async markAsRead(@Req() req: any, @Param('id') id: string) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }

    @Delete(':id')
    async deleteNotification(@Req() req: any, @Param('id') id: string) {
        return this.notificationsService.deleteNotification(id, req.user.id);
    }

    // Helper for testing or internal use
    @Post()
    async createNotification(@Req() req: any, @Body() body: { type: string; title: string; message: string }) {
        return this.notificationsService.createNotification(req.user.id, body);
    }
}
