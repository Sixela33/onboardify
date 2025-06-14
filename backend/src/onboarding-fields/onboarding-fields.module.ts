import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingFieldsService } from './onboarding-fields.service';
import { OnboardingFieldsController } from './onboarding-fields.controller';
import { OnboardingField } from './entities/onboarding-field.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingField]),
    CompaniesModule,
  ],
  controllers: [OnboardingFieldsController],
  providers: [OnboardingFieldsService],
  exports: [OnboardingFieldsService],
})
export class OnboardingFieldsModule {} 