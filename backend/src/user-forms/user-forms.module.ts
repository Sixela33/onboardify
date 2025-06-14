import { Module } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { UserFormsController } from './user-forms.controller';

@Module({
  controllers: [UserFormsController],
  providers: [UserFormsService],
})
export class UserFormsModule {}
