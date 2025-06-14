import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const secret = process.env.ACCESS_JWT_SECRET;

    if (!secret) {
      throw new Error('ACCESS_JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.access_token,
      ]),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return this.authService.validateJwtUser(userId);
  }
}
