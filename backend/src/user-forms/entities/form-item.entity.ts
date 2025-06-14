import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormEntity } from "./form.entity";

@Entity()
export class FormItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => FormEntity, form => form.items)
    form: FormEntity;

    @Column()
    step: number;
}