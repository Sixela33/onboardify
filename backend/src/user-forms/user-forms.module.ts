import { Module } from '@nestjs/common';
import { UserFormsService } from './user-forms.service';
import { UserFormsController } from './user-forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormEntity } from './entities/form.entity';
import { FormItem } from './entities/form-item.entity';
import { FormStatus } from './entities/form-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormEntity, FormItem, FormStatus])],
  controllers: [UserFormsController],
  providers: [UserFormsService],
})
export class UserFormsModule {}
