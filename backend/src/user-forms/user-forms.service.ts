import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormEntity } from './entities/form.entity';
import { FormItem } from './entities/form-item.entity';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class UserFormsService {
    constructor(
        @InjectRepository(FormEntity)
        private formRepository: Repository<FormEntity>,
        @InjectRepository(FormItem)
        private formItemRepository: Repository<FormItem>,
    ) {}

    async createForm(createFormDto: CreateFormDto): Promise<FormEntity> {
        const form = this.formRepository.create({
            name: createFormDto.name,
        });
        
        const savedForm = await this.formRepository.save(form);

        const formItems = createFormDto.items.map(item => 
            this.formItemRepository.create({
                ...item,
                form: savedForm,
            })
        );

        await this.formItemRepository.save(formItems);

        const formWithItems = await this.formRepository.findOne({
            where: { id: savedForm.id },
            relations: ['items'],
        })

        if (!formWithItems) {
            throw new Error('Form not found');
        }

        return formWithItems;
    }
}
