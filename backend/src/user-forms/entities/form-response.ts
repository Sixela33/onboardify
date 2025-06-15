import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormItem } from "./form-item.entity";

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

    @ManyToOne(() => FormItem, form => form.responses)
    form: FormItem;
    
}

