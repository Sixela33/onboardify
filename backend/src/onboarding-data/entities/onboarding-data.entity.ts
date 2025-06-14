import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class OnboardingData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  currentStep: number;

  @Column('jsonb')
  answers: Record<string, any>;

  @Column()
  completed: boolean;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;
} 