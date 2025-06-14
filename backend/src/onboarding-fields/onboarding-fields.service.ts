import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingField } from './entities/onboarding-field.entity';
import { CreateOnboardingFieldsDto } from './dto/create-onboarding-field.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class OnboardingFieldsService {
  constructor(
    @InjectRepository(OnboardingField)
    private onboardingFieldsRepository: Repository<OnboardingField>,
    private companiesService: CompaniesService,
  ) {}

  async create(companyId: string, createOnboardingFieldsDto: CreateOnboardingFieldsDto): Promise<OnboardingField[]> {
    const company = await this.companiesService.findOne(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    const fields = createOnboardingFieldsDto.fields.map(field => {
      const onboardingField = this.onboardingFieldsRepository.create({
        ...field,
        companyId,
      });
      return onboardingField;
    });

    return await this.onboardingFieldsRepository.save(fields);
  }

  async findByCompanyId(companyId: string): Promise<OnboardingField[]> {
    return await this.onboardingFieldsRepository.find({
      where: { companyId },
    });
  }
} 