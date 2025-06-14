import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  Body, 
  Query,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { WhatsappService } from './services/whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';


interface BulkMessageDto {
  csvData: string;
  message: string;
  delayBetweenMessages?: number;
}

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('auth/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateAuth(@Req() req: Request & { user: { id: string } }) {
    try {
      const result = await this.whatsappService.initiateAuth(req.user.id);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new BadRequestException(`Failed to initiate authentication: ${error.message}`);
    }
  }

  @Get('session/status')
  getSessionStatus(@Req() req: Request & { user: { id: string } }) {
    const sessionId = req.user.id;

    const status = this.whatsappService.getSessionStatus(sessionId);
    if (!status) {
      throw new NotFoundException('Session not found');
    }

    return {
      success: true,
      data: status
    };
  }

  @Get('session/qr')
  getQRCode(@Req() req: Request & { user: { id: string } }) {
    const sessionId = req.user.id;

    const status = this.whatsappService.getSessionStatus(sessionId);
    if (!status) {
      throw new NotFoundException('Session not found');
    }

    if (!status.qrCode) {
      return {
        success: false,
        message: 'QR code not available yet'
      };
    }

    return {
      success: true,
      data: {
        qrCode: status.qrCode,
        status: status.status
      }
    };
  }

  @Delete('session/disconnect')
  @HttpCode(HttpStatus.OK)
  disconnectSession(@Req() req: Request & { user: { id: string } }) {
    const sessionId = req.user.id;

    const success = this.whatsappService.disconnectSession(sessionId);
    if (!success) {
      throw new NotFoundException('Session not found');
    }

    return {
      success: true,
      message: 'Session disconnected successfully'
    };
  }

  @Post('session/bulk-message')
  @HttpCode(HttpStatus.OK)
  async sendBulkMessages(
    @Req() req: Request & { user: { id: string } },
    @Body() bulkMessageDto: BulkMessageDto
  ) {
    const sessionId = req.user.id;

    if (!bulkMessageDto.csvData || !bulkMessageDto.message) {
      throw new BadRequestException('csvData and message are required');
    }

    try {
      const result = await this.whatsappService.sendBulkMessages(
        sessionId,
        bulkMessageDto.csvData,
        bulkMessageDto.message,
        bulkMessageDto.delayBetweenMessages || 2000
      );

      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new BadRequestException(`Failed to send bulk messages: ${error.message}`);
    }
  }
}
