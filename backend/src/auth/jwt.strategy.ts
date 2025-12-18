import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}
