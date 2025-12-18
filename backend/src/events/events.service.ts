import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class EventsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService
    ) { }

    async create(data: any) {
        const event = await this.prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date), // Ensure date is Date object
                coverImage: data.coverImage,
                registrationLink: data.registrationLink,
                location: data.location,
                tags: data.tags,
                type: data.type || "Workshop",
                isVisible: true
            }
        });

        // Broadcast emails to everyone
        await this.emailService.sendEventEmail(event).catch(err => console.error("Event Email Error:", err));

        return event;
    }

    async findAll() {
        return this.prisma.event.findMany({
            where: { isVisible: true },
            orderBy: { date: 'asc' }
        });
    }
    async delete(id: string) {
        return this.prisma.event.delete({
            where: { id }
        });
    }
}
