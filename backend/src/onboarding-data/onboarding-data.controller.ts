import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OnboardingDataService } from './onboarding-data.service';

@Controller('onboarding')
export class OnboardingDataController {
  constructor(private readonly onboardingDataService: OnboardingDataService) {}

  @Post('next-question')
  getNextQuestion(
    @Body('phoneNumber') phoneNumber: string,
    @Body('companyId') companyId: string,
  ) {
    return this.onboardingDataService.getNextQuestion(phoneNumber, companyId);
  }

  @Post('answer')
  saveAnswer(
    @Body('phoneNumber') phoneNumber: string,
    @Body('companyId') companyId: string,
    @Body('fieldName') fieldName: string,
    @Body('answer') answer: string,
  ) {
    return this.onboardingDataService.saveAnswer(phoneNumber, companyId, fieldName, answer);
  }

  @Get('status/:companyId/:phoneNumber')
  getStatus(
    @Param('phoneNumber') phoneNumber: string,
    @Param('companyId') companyId: string,
  ) {
    return this.onboardingDataService.getStatus(phoneNumber, companyId);
  }
} 