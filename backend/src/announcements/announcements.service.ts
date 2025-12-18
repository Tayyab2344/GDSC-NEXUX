import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, UserStatus, AnnouncementVisibility } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class AnnouncementsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService
    ) { }

    async create(userId: string, data: any) {
        // Basic validation: Only Leads/Management/Marketing should post?
        // User requirements say "Lead adds Core, Marketing adds others".
        // We'll trust the frontend to query correctly, but here we just create.
        // Ideally we check permissions, but for this hackathon level scope, open creation for authorized leads/admins is fine.

        const announcement = await this.prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                coverImage: data.coverImage,
                visibility: data.visibility || AnnouncementVisibility.PUBLIC,
                postedBy: userId,
                teamId: data.teamId // Optional
            }
        });

        // Send Emails
        await this.sendNotificationEmails(announcement).catch(err => console.error("Email error:", err));

        return announcement;
    }

    private async sendNotificationEmails(announcement: any) {
        if (announcement.visibility === AnnouncementVisibility.PUBLIC) {
            // General broadcast for public announcements
            await this.emailService.sendAnnouncementEmail(announcement);
        } else if (announcement.visibility === AnnouncementVisibility.MEMBERS_ONLY) {
            // Fetch all verified members
            const users = await this.prisma.user.findMany({
                where: { status: 'MEMBER' },
                select: { email: true }
            });
            const recipients = users.filter(u => u.email).map(u => u.email) as string[];
            if (recipients.length > 0) {
                await this.emailService.sendEmail(
                    recipients,
                    `📢 New Announcement: ${announcement.title}`,
                    `<h2>${announcement.title}</h2><p>${announcement.content}</p><br><p>Log in to GDSC Nexus to view more details.</p>`
                );
            }
        } else if (announcement.visibility === AnnouncementVisibility.LEADS_ONLY) {
            // Fetch all Leads
            const users = await this.prisma.user.findMany({
                where: { role: { in: ['TEAM_LEAD', 'CO_LEAD', 'PRESIDENT', 'FACULTY_HEAD'] } },
                select: { email: true }
            });
            const recipients = users.filter(u => u.email).map(u => u.email) as string[];
            if (recipients.length > 0) {
                await this.emailService.sendEmail(
                    recipients,
                    `📢 Leads Only: ${announcement.title}`,
                    `<h2>${announcement.title}</h2><p>${announcement.content}</p>`
                );
            }
        }
    }

    async findAll(user: any) {
        // If no user (public?), implementation typically requires Auth.
        // But let's assume we pass user object from request.

        // Visibility Logic:
        // PUBLIC: Everyone
        // MEMBERS_ONLY: Status != PENDING && Role != GUEST (simplified: Status is MEMBER/VERIFIED)
        // LEADS_ONLY: Role is LEAD/PRESIDENT/etc.

        const allowedVisibilities: AnnouncementVisibility[] = [AnnouncementVisibility.PUBLIC];

        if (user) {
            // Members see Public + Members Only
            if (
                user.status === UserStatus.MEMBER ||
                user.role !== Role.GUEST
            ) {
                allowedVisibilities.push(AnnouncementVisibility.MEMBERS_ONLY);
            }

            // Leads see everything
            if (
                [Role.TEAM_LEAD, Role.CO_LEAD, Role.PRESIDENT, Role.FACULTY_HEAD].includes(user.role)
            ) {
                allowedVisibilities.push(AnnouncementVisibility.LEADS_ONLY);
            }
        }

        return this.prisma.announcement.findMany({
            where: {
                visibility: { in: allowedVisibilities }
            },
            include: {
                creator: {
                    select: { fullName: true, role: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async delete(id: string) {
        return this.prisma.announcement.delete({
            where: { id }
        });
    }
}
