import { Controller } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';

@Controller('user-forms')
export class UserFormsController {
  constructor(private readonly userFormsService: UserFormsService) {}
}
