import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormEntity } from "./form.entity";

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
}