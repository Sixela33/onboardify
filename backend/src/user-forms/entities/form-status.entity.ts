import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FormEntity } from "./form.entity";
import { FormResponse } from "./form-response";

@Entity()
export class FormStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phoneNumber: string;

    @ManyToOne(() => FormEntity, form => form.status)
    form: FormEntity;

    @Column()
    actualStep: number;

    @OneToMany(() => FormResponse, response => response.formStatus)
    responses: FormResponse[];
}