import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Whitelisted {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phone: string;

    @ManyToOne(() => User, (user) => user.whitelisted)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}