
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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
}
