import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormEntity } from './entities/form.entity';
import { FormItem } from './entities/form-item.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { FormStatus } from './entities/form-status.entity';
import { FormResponse } from './entities/form-response';

@Injectable()
export class UserFormsService {
    constructor(
        @InjectRepository(FormEntity)
        private formRepository: Repository<FormEntity>,
        @InjectRepository(FormItem)
        private formItemRepository: Repository<FormItem>,
        @InjectRepository(FormStatus)
        private formStatusRepository: Repository<FormStatus>,
        @InjectRepository(FormResponse)
        private formResponseRepository: Repository<FormResponse>,
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

    async startForm(phoneNumber: string, formId: string): Promise<FormStatus> {
        const formStatus = this.formStatusRepository.create({
            phoneNumber,
            form: { id: parseInt(formId) },
            actualStep: 0,
        });

        const savedFormStatus = await this.formStatusRepository.save(formStatus);

        return savedFormStatus;
    }

    async getFormStatusByPhone(phoneNumber: string): Promise<FormStatus> {
        const formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber },
            relations: ['form', 'form.items'],
        });

        if (!formStatus) {
            throw new Error('Form not found for this phone number');
        }

        return formStatus;
    }

    async getNextQuestionByPhone(phoneNumber: string): Promise<FormItem | null> {
        const formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber },
            relations: ['form', 'form.items'],
        });

        if (!formStatus) {
            throw new Error('Form not found for this phone number');
        }

        const nextQuestion = formStatus.form.items.find(item => item.step === formStatus.actualStep + 1);

        if (!nextQuestion) {
            return null;
        }

        return nextQuestion;
    }

    async saveResponse(phoneNumber: string, formId: string, step: string, response: FormResponse): Promise<boolean> {
        const formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber, form: { id: parseInt(formId) } },
            relations: ['form', 'form.items'],
        });

        if(!formStatus) {
            throw new Error('Form not found for this phone number');
        }

        if(formStatus.actualStep !== parseInt(step)) {
            throw new Error('Step not found for this phone number');
        }

        const formResponse = this.formResponseRepository.create({
            formStatus: formStatus,
            response: response.response,
            formId: parseInt(formId)
        });

        await this.formResponseRepository.save(formResponse);

        return true;
    }
}
