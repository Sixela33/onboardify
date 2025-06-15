import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { FormEntity } from './entities/form.entity';
import { SaveResponseDto } from './dto/save-response.dto';

@Controller('user-forms')
export class UserFormsController {
  constructor(private readonly userFormsService: UserFormsService) {}

  @Post()
  async createForm(@Body() createFormDto: CreateFormDto): Promise<FormEntity> {
    return this.userFormsService.createForm(createFormDto);
  }

  @Get()
  async getAllForms(): Promise<FormEntity[]> {
    return this.userFormsService.getAllForms();
  }

  @Get('form-status')
  async getAllFormStatuses() {
    return this.userFormsService.getAllFormStatuses();
  }

  @Get('actual-question/:phoneNumber')
  async getActualQuestion(@Param('phoneNumber') phoneNumber: string) {
    return this.userFormsService.getActualQuestionByPhone(phoneNumber);
  }

  @Get('next-question/:phoneNumber')
  async getNextQuestion(@Param('phoneNumber') phoneNumber: string) {
    return this.userFormsService.getNextQuestionByPhone(phoneNumber);
  }

  @Post('respond/:phoneNumber/:formId/:step')
  async saveResponse(
    @Param('phoneNumber') phoneNumber: string, 
    @Param('formId') formId: string, 
    @Param('step') step: string, 
    @Body() response: SaveResponseDto
  ) {
    return this.userFormsService.saveResponse(phoneNumber, formId, step, response);
  }

  @Post('start/:phoneNumber/:formId')
  async startForm(@Param('phoneNumber') phoneNumber: string, @Param('formId') formId: string) {
    return this.userFormsService.startForm(phoneNumber, formId);
  }

 
}
