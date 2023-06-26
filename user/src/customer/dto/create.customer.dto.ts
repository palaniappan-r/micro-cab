import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
export class CreateCustomerDto {
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