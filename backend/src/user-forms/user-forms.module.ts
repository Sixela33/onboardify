import { Module } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { UserFormsController } from './user-forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormEntity } from './entities/form.entity';
import { FormItem } from './entities/form-item.entity';
import { FormStatus } from './entities/form-status.entity';
import { FormResponse } from './entities/form-response';

@Module({
  imports: [TypeOrmModule.forFeature([FormEntity, FormItem, FormStatus, FormResponse])],
  controllers: [UserFormsController],
  providers: [UserFormsService],
})
export class UserFormsModule {}
