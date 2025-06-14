import { Controller, Post, Body } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { FormEntity } from './entities/form.entity';

@Controller('user-forms')
export class UserFormsController {
  constructor(private readonly userFormsService: UserFormsService) {}

  @Post()
  async createForm(@Body() createFormDto: CreateFormDto): Promise<FormEntity> {
    return this.userFormsService.createForm(createFormDto);
  }
}
