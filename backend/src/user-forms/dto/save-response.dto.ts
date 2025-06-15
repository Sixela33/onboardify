import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SaveResponseDto {
    @IsString()
    @IsNotEmpty()
    response: string;

    @IsNumber()
    @IsNotEmpty()
    formId: number;

}
