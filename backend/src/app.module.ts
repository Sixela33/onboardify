import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { UserFormsModule } from './user-forms/user-forms.module';
import { CompaniesModule } from './companies/companies.module';
import { OnboardingFieldsModule } from './onboarding-fields/onboarding-fields.module';
import { OnboardingDataModule } from './onboarding-data/onboarding-data.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'onboardify',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    WhatsappModule,
    UserFormsModule,
    CompaniesModule,
    OnboardingFieldsModule,
    OnboardingDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
