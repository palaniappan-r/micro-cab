import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { GeoJSON, GeoJsonObject } from 'geojson';
import { StringifyOptions } from "querystring";

export class CreateTripCustomerDto {
    @IsNotEmpty()
    customerId: string;

    @IsNotEmpty()
    startPt: number[];

    @IsNotEmpty()
    endPt : number[];
}

export class UpdateTripCustomerDto extends PartialType(CreateTripCustomerDto) {
    @IsNotEmpty()
    tripId : string

    @IsNotEmpty()
    customerId: string;
    
    @IsNotEmpty()
    startPt: number[];

    @IsNotEmpty()
    endPt : number[];
}

export class AcceptTripDriverDto {
    @IsNotEmpty()
    tripId : string

    @IsNotEmpty()
    driverId : string

    @IsNotEmpty()
    price : number
}

export class CancelTripDriverDto {
    @IsNotEmpty()
    tripId : string

    @IsNotEmpty()
    driverId : string
}

export class EndTripDriverDto extends PartialType(CancelTripDriverDto){}