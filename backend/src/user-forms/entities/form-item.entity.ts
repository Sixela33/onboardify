import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormEntity } from "./form.entity";

export enum FormItemType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    FILE = 'file',
}

@Entity()
export class FormItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    question: string;

    @Column({ type: 'enum', enum: FormItemType, nullable: true })
    type: FormItemType;

    @ManyToOne(() => FormEntity, form => form.items)
    form: FormEntity;

    @Column()
    step: number;
}