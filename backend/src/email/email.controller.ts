import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.PRESIDENT, Role.CO_LEAD, Role.TEAM_LEAD)
    @Post('broadcast')
    async sendManualBroadcast(@Body() body: { subject: string, content: string }) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #EA4335; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin:0;">📢 Important Update</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">${body.subject}</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">${body.content}</p>
                </div>
                <div style="background: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    This is an official communication from GDSC Nexus Management.
                </div>
            </div>
        `;
        return this.emailService.broadcastToAll(body.subject, html);
    }
}
