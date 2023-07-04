import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateDriverDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}

export class UpdateDriverDto extends PartialType(CreateDriverDto) {}