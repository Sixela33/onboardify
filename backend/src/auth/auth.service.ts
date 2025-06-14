import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }
  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_JWT_SECRET,
        expiresIn: process.env.ACCESS_JWT_EXPIRE_IN,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: userId };
  }

  async signOut(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, undefined);
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser: CurrentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }
}
