import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @Public()
   * @HttpCode(HttpStatus.OK)
   * @UseGuards(LocalAuthGuard)
   * @Post('login')
   * async login(@Request() req) {
   *   return this.authService.login(req.user.id);
   * }
  */

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Req() req, @Res() res) {
    const result = await this.authService.signOut(req.user.id);
    console.log(result);
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',
      maxAge: 0, // 15 minutes (adjust based on your token expiry)
    });
    
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',
      maxAge: 0, // 15 minutes (adjust based on your token expiry)
    });

    res.sendStatus(200);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);
    
    // Option 1: Set token in an HTTP-only cookie
    res.cookie('access_token', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes (adjust based on your token expiry)
    });
    
    // Redirect to frontend without exposing token in URL
    res.redirect('http://localhost:5173');
  }
}
