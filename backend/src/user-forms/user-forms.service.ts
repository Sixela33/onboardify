import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormEntity } from './entities/form.entity';
import { FormItem } from './entities/form-item.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { FormStatus } from './entities/form-status.entity';
import { FormResponse } from './entities/form-response';
import { SaveResponseDto } from './dto/save-response.dto';

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

    async getAllForms(): Promise<FormEntity[]> {
        return this.formRepository.find({
            relations: ['items', 'status'],
        });
    }

    async getOneForm(): Promise<FormEntity> {
        const form = await this.formRepository.find({
            relations: ['items'],
        });

        if (!form) {
            throw new Error('Form not found');
        }

        return form[0];
    }
    
    async startForm(phoneNumber: string, formId: string): Promise<FormStatus> {
        const formStatus = this.formStatusRepository.create({
            phoneNumber,
            form: { id: parseInt(formId) },
            actualStep: 1,
        });

        await this.formStatusRepository.save(formStatus);

        return await this.getFormStatusByPhone(phoneNumber);
    }

    async getFormStatusByPhone(phoneNumber: string): Promise<FormStatus> {
        let formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber },
            relations: ['form', 'form.items', 'form.status'],
        });

        if (!formStatus) {
            const form = await this.getOneForm();
            formStatus = await this.startForm(phoneNumber, form.id.toString());
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

    async getActualQuestionByPhone(phoneNumber: string): Promise<FormItem & { formId: number, step: number, new_form: boolean, formItems: any[] } | null> {
        let formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber },
            relations: ['form', 'form.items', 'form.items.responses'],
        });

        let new_form = false

        if (!formStatus) {
            const form = await this.getOneForm();
            formStatus = await this.startForm(phoneNumber, form.id.toString());
            new_form = true;
        }

        const formResponses = await this.formResponseRepository.find({
            where: { form: { id: formStatus.form.id } },
            relations: ['form'],
        });

        const formItems = formResponses.map((response, index) => {
            return ({
                question: formStatus.form.items[index].question,
                response: response.response,
            })
        });

        const actualQuestion = formStatus.form.items.find(item => item.step === formStatus.actualStep );

        if (!actualQuestion) {
            return null;
        }
        const item = {
            ...actualQuestion,
            formId: formStatus.form.id,
            step: formStatus.actualStep,
            new_form: new_form,
            formItems: formItems
        }
        return item;
    }

    async saveResponse(phoneNumber: string, formId: string, step: string, response: SaveResponseDto): Promise<boolean> {
        let formStatus = await this.formStatusRepository.findOne({
            where: { phoneNumber, form: { id: parseInt(formId) } },
            relations: ['form', 'form.items'],
        });

        if(!formStatus) {
            const form = await this.getOneForm();
            formStatus = await this.startForm(phoneNumber, form.id.toString());
        }

        if(formStatus.actualStep !== parseInt(step)) {
            throw new Error('Step not found for this phone number');
        }

        const formResponse = this.formResponseRepository.create({
            response: response.response,
            formId: parseInt(formId)
        });

        await this.formResponseRepository.save(formResponse);

        formStatus.actualStep++;
        await this.formStatusRepository.save(formStatus);

        return true;
    }

    async getAllFormStatuses(): Promise<FormStatus[]> {
        return this.formStatusRepository.find({
            relations: ['form', 'form.items', 'form.status'],
        });
    }

    async getAllChats() {
        const formStatuses = await this.formStatusRepository.find({
            relations: ['form', 'form.items'],
        });

        const chats = await Promise.all(
            formStatuses.map(async (status) => {
                const responses = await this.formResponseRepository.find({
                    where: { formId: status.form.id },
                    order: { id: 'ASC' },
                });

                const formItems = status.form.items.sort((a, b) => a.step - b.step);
                const conversation = formItems.map((item, index) => ({
                    question: item.question,
                    response: responses[index]?.response || null,
                    step: item.step,
                }));                

                return {
                    phoneNumber: status.phoneNumber,
                    formId: status.form.id,
                    formName: status.form.name,
                    currentStep: status.actualStep,
                    isComplete: status.actualStep > formItems.length,
                    conversation
                };
            })
        );

        return chats;
    }
}
