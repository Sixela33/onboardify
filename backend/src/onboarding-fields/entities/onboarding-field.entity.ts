import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class OnboardingField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fieldId: string;

  @Column()
  type: string;

  @Column()
  question: string;

  @Column()
  required: boolean;

  @Column({ nullable: true })
  fileType?: string;

  @ManyToOne(() => Company, company => company.onboardingFields)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;
} 