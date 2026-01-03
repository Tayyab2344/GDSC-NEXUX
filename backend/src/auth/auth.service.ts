
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async validateUser(googleUser: any) {
        const user = await this.usersService.findByGoogleIdOrCreate(googleUser);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async validateUserLocal(identifier: string, pass: string): Promise<any> {
        const user = await this.usersService.findByIdentifier(identifier) as any;
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(userDto: any) {
        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userDto.password, salt);

        // Create user
        const newUser = await this.usersService.create({
            ...userDto,
            password: hashedPassword,
        });

        // Generate token (auto-login)
        return this.login(newUser);
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return { success: true, message: 'If this email exists, a reset link has been sent.' };

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hr

        await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpiry);
        await this.mailService.sendPasswordReset(email, resetToken);

        return { success: true, message: 'Password reset link sent.' };
    }

    async resetPassword(token: string, newPass: string) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException('Invalid or expired token');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPass, salt);

        await this.usersService.updatePassword(user.id, hashedPassword);

        return { success: true, message: 'Password reset successfully.' };
    }
}
