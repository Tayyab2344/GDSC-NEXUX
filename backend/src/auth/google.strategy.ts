import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    console.log('GoogleStrategy initialized with:', {
      clientID: clientID ? 'Set' : 'Missing',
      clientSecret: clientSecret ? 'Set' : 'Missing',
      callbackURL
    });

    super({
      clientID: clientID || '',
      clientSecret: clientSecret || '',
      callbackURL: callbackURL || 'http://localhost:3001/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails?.[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
      accessToken,
      googleId: id,
    };

    const dbUser = await this.authService.validateUser(user);
    done(null, dbUser);
  }
}
