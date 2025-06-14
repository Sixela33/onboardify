import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { FormEntity } from './entities/form.entity';
import { FormResponse } from './entities/form-response';

@Controller('user-forms')
export class UserFormsController {
  constructor(private readonly userFormsService: UserFormsService) {}

  @Post()
  async createForm(@Body() createFormDto: CreateFormDto): Promise<FormEntity> {
    return this.userFormsService.createForm(createFormDto);
  }

  @Get('status/:phoneNumber')
  async getFormStatus(@Param('phoneNumber') phoneNumber: string) {
    return this.userFormsService.getFormStatusByPhone(phoneNumber);
  }

  @Get('next-question/:phoneNumber')
  async getNextQuestion(@Param('phoneNumber') phoneNumber: string) {
    return this.userFormsService.getNextQuestionByPhone(phoneNumber);
  }

  @Post('respond/:phoneNumber/:formId/:step')
  async saveResponse(@Param('phoneNumber') phoneNumber: string, @Param('formId') formId: string, @Param('step') step: string, @Body() response: FormResponse) {
    return this.userFormsService.saveResponse(phoneNumber, formId, step, response);
  }

  @Post('start/:phoneNumber/:formId')
  async startForm(@Param('phoneNumber') phoneNumber: string, @Param('formId') formId: string) {
    return this.userFormsService.startForm(phoneNumber, formId);
  }
}
