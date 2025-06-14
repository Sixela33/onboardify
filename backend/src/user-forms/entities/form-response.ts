import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormStatus } from "./form-status.entity";

@Entity()
export class FormResponse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    formId: number;

    @ManyToOne(() => FormStatus, formStatus => formStatus.responses)
    formStatus: FormStatus;

    @Column()
    response: string;

    @Column()
    createdAt: Date;
    
}