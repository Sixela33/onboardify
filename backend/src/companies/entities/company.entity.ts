import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OnboardingField } from '../../onboarding-fields/entities/onboarding-field.entity';

@Entity()
export class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OnboardingField, (field) => field.company)
  onboardingFields: OnboardingField[];
}
