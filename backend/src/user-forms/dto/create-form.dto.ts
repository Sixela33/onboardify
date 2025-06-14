import { IsString, IsArray, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { FormItemType } from '../entities/form-item.entity';

export class CreateFormItemDto {
    @IsString()
    name: string;

    @IsString()
    question: string;

    @IsEnum(FormItemType)
    type: FormItemType;

    @IsNumber()
    step: number;
}

export class CreateFormDto {
    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFormItemDto)
    items: CreateFormItemDto[];
} 