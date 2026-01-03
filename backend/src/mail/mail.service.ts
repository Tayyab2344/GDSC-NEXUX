import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(options: MailOptions) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Google Society" <noreply@googlesociety.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return { success: true };
    } catch (error) {
      console.error('Mail send error:', error);
      return { success: false, error };
    }
  }

  // Email Templates
  async sendApplicationReceived(email: string, name: string) {
    return this.sendMail({
      to: email,
      subject: 'Application Received - Google Society',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4285F4, #34A853); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Google Society</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name}! 👋</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for applying to join the Google Society. We have received your application and our team is reviewing it.
            </p>
            <p style="color: #666; line-height: 1.6;">
              You will receive an email notification once your application has been processed.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #4285F4; margin: 0 3px;"></span>
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #EA4335; margin: 0 3px;"></span>
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #FBBC05; margin: 0 3px;"></span>
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #34A853; margin: 0 3px;"></span>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} Google Society. All rights reserved.
          </div>
        </div>
      `,
    });
  }

  async sendApplicationApproved(email: string, name: string) {
    return this.sendMail({
      to: email,
      subject: '🎉 Welcome to the Google Society!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #34A853, #4285F4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Congratulations, ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Your application has been <strong style="color: #34A853;">approved</strong>! You are now officially a member of the Google Society.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Log in to your dashboard to explore teams, join learning fields, and connect with fellow members.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #4285F4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  async sendApplicationRejected(email: string, name: string, reason?: string) {
    return this.sendMail({
      to: email,
      subject: 'Application Update - Google Society',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #333; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Google Society</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for your interest in joining the Google Society. After careful review, we regret to inform you that we are unable to approve your application at this time.
            </p>
            ${reason ? `<p style="color: #666; line-height: 1.6;"><strong>Reason:</strong> ${reason}</p>` : ''}
            <p style="color: #666; line-height: 1.6;">
              You are welcome to apply again in the future. We appreciate your interest!
            </p>
          </div>
        </div>
      `,
    });
  }

  async sendClassReminder(email: string, name: string, classTitle: string, scheduledAt: Date) {
    return this.sendMail({
      to: email,
      subject: `📚 Class Reminder: ${classTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4285F4; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Class Reminder</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              This is a reminder that your class <strong>${classTitle}</strong> is scheduled for:
            </p>
            <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; color: #4285F4; margin: 0;">
                ${scheduledAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p style="font-size: 18px; color: #666; margin: 10px 0 0 0;">
                ${scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard/classes" style="background: #34A853; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View Class
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  async sendEventAnnouncement(email: string, name: string, eventTitle: string, eventDate: Date, description: string) {
    return this.sendMail({
      to: email,
      subject: `🎪 New Event: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FBBC05, #EA4335); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Event!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">${eventTitle}</h2>
            <p style="color: #666; line-height: 1.6;">${description}</p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="color: #4285F4; margin: 0;">
                📅 ${eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/events" style="background: #EA4335; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View Event
              </a>
            </div>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    return this.sendMail({
      to: email,
      subject: '🔐 Password Reset Request - Google Society',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #EA4335; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
            <p style="color: #666; line-height: 1.6;">
                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: #EA4335; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                Reset Password
                </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #4285F4;">${resetLink}</a>
            </p>
            </div>
        </div>
        `,
    });
  }
}
