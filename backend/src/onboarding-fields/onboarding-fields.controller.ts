import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OnboardingFieldsService } from './onboarding-fields.service';
import { CreateOnboardingFieldsDto } from './dto/create-onboarding-field.dto';

@Controller('companies/:companyId/onboarding-fields')
export class OnboardingFieldsController {
  constructor(private readonly onboardingFieldsService: OnboardingFieldsService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createOnboardingFieldsDto: CreateOnboardingFieldsDto,
  ) {
    return this.onboardingFieldsService.create(companyId, createOnboardingFieldsDto);
  }

  @Get()
  findByCompanyId(@Param('companyId') companyId: string) {
    return this.onboardingFieldsService.findByCompanyId(companyId);
  }
} 