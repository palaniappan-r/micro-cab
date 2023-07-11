import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { GeoJSON, GeoJsonObject } from 'geojson';

export class CreateTripCustomerDto {
    @IsNotEmpty()
    customerId: string;

    @IsNotEmpty()
    startPt: number[];

    @IsString()
    endPt : number[];
}

export class UpdateDriverDto extends PartialType(CreateTripCustomerDto) {}