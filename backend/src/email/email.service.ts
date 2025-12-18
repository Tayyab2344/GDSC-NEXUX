import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
    private transporter;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        // Setup transporter
        const host = this.configService.get('MAIL_HOST');
        const user = this.configService.get('MAIL_USER');
        const pass = this.configService.get('MAIL_PASS');
        const port = this.configService.get('MAIL_PORT') || 587;

        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port: Number(port),
                secure: false, // true for 465, false for other ports
                auth: { user, pass }
            });
            console.log("✅ Email Transporter configured.");
        } else {
            console.warn("⚠️ SMTP Credentials not found (MAIL_HOST/USER/PASS). Emails will be logged to console only.");
        }
    }

    async sendEmail(to: string[], subject: string, html: string) {
        if (!to || to.length === 0) {
            console.log(`⚠️ No recipients found for email: ${subject}`);
            return;
        }

        const fromConfig = this.configService.get('MAIL_FROM') || '"GDSC Nexus" <noreply@gdsc.dev>';

        const mailOptions = {
            from: fromConfig,
            to: fromConfig, // Self-send to avoid empty 'To'
            bcc: to, // Use BCC for mass emails
            subject,
            html
        };

        if (this.transporter) {
            try {
                console.log(`📤 Attempting to send email to ${to.length} recipients. Subject: ${subject}`);
                await this.transporter.sendMail(mailOptions);
                console.log(`📧 Email sent successfully! Subject: ${subject}`);
                return { success: true };
            } catch (error) {
                console.error("❌ Failed to send email:", error);
                return { success: false, error };
            }
        } else {
            console.log(`[MOCK EMAIL] To: ${to.length} recipients | Subject: ${subject}`);
            return { success: true, mock: true };
        }
    }

    async broadcastToAll(subject: string, html: string) {
        const users = await this.prisma.user.findMany({
            where: { email: { not: "" } },
            select: { email: true }
        });
        const recipients = users.map(u => u.email).filter(Boolean) as string[];
        console.log(`👥 Broadcast target list: ${recipients.join(', ')}`);
        return this.sendEmail(recipients, subject, html);
    }

    async sendAnnouncementEmail(announcement: any) {
        const title = announcement.title;
        const content = announcement.content;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #4285F4; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin:0;">New Announcement</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">${title}</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">${content}</p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${this.configService.get('FRONTEND_URL')}/announcements" 
                           style="background: #4285F4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                           Read Full Announcement
                        </a>
                    </div>
                </div>
                <div style="background: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} GDSC Nexus. All rights reserved.
                </div>
            </div>
        `;
        return this.broadcastToAll(`GDSC Announcement: ${title}`, html);
    }

    async sendEventEmail(event: any) {
        const title = event.title;
        const date = new Date(event.date).toLocaleDateString();
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #34A853; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin:0;">New Event: ${title}</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">Upcoming Workshop/Event</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">${event.description}</p>
                    <div style="background: #f0f7f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #34A853; font-weight: bold;">📅 Date: ${date}</p>
                        <p style="margin: 5px 0 0 0; color: #666;">📍 Location: ${event.location || 'Online'}</p>
                    </div>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${this.configService.get('FRONTEND_URL')}/events" 
                           style="background: #34A853; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                           Register Now
                        </a>
                    </div>
                </div>
                <div style="background: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} GDSC Nexus. All rights reserved.
                </div>
            </div>
        `;
        return this.broadcastToAll(`New Event Alert: ${title}`, html);
    }
}
