import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormItemDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

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