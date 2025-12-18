
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    async sendEmail(to: string, subject: string, content: string) {
        // TODO: Implement Nodemailer
        console.log(`Sending email to ${to}: ${subject}`);
    }
}
