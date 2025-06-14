import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingData } from './entities/onboarding-data.entity';
import { CompaniesService } from '../companies/companies.service';
import { OnboardingFieldsService } from '../onboarding-fields/onboarding-fields.service';

@Injectable()
export class OnboardingDataService {
  constructor(
    @InjectRepository(OnboardingData)
    private onboardingDataRepository: Repository<OnboardingData>,
    private companiesService: CompaniesService,
    private onboardingFieldsService: OnboardingFieldsService,
  ) {}

  async getNextQuestion(phoneNumber: string, companyId: string) {
    const company = await this.companiesService.findOne(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    let onboardingData = await this.onboardingDataRepository.findOne({
      where: { phoneNumber, companyId },
    });

    if (!onboardingData) {
      onboardingData = this.onboardingDataRepository.create({
        phoneNumber,
        companyId,
        currentStep: 0,
        answers: {},
        completed: false,
      });
      await this.onboardingDataRepository.save(onboardingData);
    }

    if (onboardingData.completed) {
      return { completed: true, message: '¡Onboarding completado!' };
    }

    const fields = await this.onboardingFieldsService.findByCompanyId(companyId);
    if (onboardingData.currentStep >= fields.length) {
      onboardingData.completed = true;
      await this.onboardingDataRepository.save(onboardingData);
      return { completed: true, message: '¡Onboarding completado!' };
    }

    const currentField = fields[onboardingData.currentStep];
    return {
      question: currentField.question,
      fieldName: currentField.fieldId,
      type: currentField.type,
      required: currentField.required,
    };
  }

  async saveAnswer(phoneNumber: string, companyId: string, fieldName: string, answer: string) {
    const onboardingData = await this.onboardingDataRepository.findOne({
      where: { phoneNumber, companyId },
    });

    if (!onboardingData) {
      throw new NotFoundException('Onboarding data not found');
    }

    const fields = await this.onboardingFieldsService.findByCompanyId(companyId);
    const currentField = fields[onboardingData.currentStep];

    if (currentField.type === 'file' && !answer.endsWith('.pdf')) {
      throw new Error('El archivo debe ser PDF');
    }

    onboardingData.answers[fieldName] = answer;
    onboardingData.currentStep++;

    if (onboardingData.currentStep >= fields.length) {
      onboardingData.completed = true;
    }

    return await this.onboardingDataRepository.save(onboardingData);
  }

  async getStatus(phoneNumber: string, companyId: string) {
    const onboardingData = await this.onboardingDataRepository.findOne({
      where: { phoneNumber, companyId },
    });

    if (!onboardingData) {
      throw new NotFoundException('Onboarding data not found');
    }

    return onboardingData;
  }
} 