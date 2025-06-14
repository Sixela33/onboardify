import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FieldDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsString()
  question: string;

  @IsBoolean()
  required: boolean;

  @IsString()
  @IsOptional()
  fileType?: string;
}

export class CreateOnboardingFieldsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];
}
