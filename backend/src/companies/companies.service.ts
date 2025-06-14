import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findOne(id: string): Promise<Company> {
    return await this.companiesRepository.findOne({
      where: { id },
      relations: ['onboardingFields'],
    });
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find({
      relations: ['onboardingFields'],
    });
  }
} 