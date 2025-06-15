import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormStatus } from "./form-status.entity";

@Entity()
export class FormResponse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    formId: number;

    @Column()
    response: string;

    @CreateDateColumn()
    createdAt: Date;
    
}

