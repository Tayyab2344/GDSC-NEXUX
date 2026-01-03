import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId },
            data: { read: true },
        });
    }

    async deleteNotification(id: string, userId: string) {
        return this.prisma.notification.deleteMany({
            where: { id, userId },
        });
    }

    async createNotification(userId: string, data: { type: string; title: string; message: string }) {
        return this.prisma.notification.create({
            data: {
                ...data,
                userId,
            },
        });
    }
}
