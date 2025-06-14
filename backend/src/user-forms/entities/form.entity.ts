import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FormItem } from "./form-item.entity";
import { FormStatus } from "./form-status.entity";

@Entity()
export class FormEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => FormItem, item => item.form)
    items: FormItem[];

    @OneToMany(() => FormStatus, status => status.form)
    status: FormStatus[];
}