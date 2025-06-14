import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingDataService } from './onboarding-data.service';
import { OnboardingDataController } from './onboarding-data.controller';
import { OnboardingData } from './entities/onboarding-data.entity';
import { CompaniesModule } from '../companies/companies.module';
import { OnboardingFieldsModule } from '../onboarding-fields/onboarding-fields.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingData]),
    CompaniesModule,
    OnboardingFieldsModule,
  ],
  controllers: [OnboardingDataController],
  providers: [OnboardingDataService],
})
export class OnboardingDataModule {} 