import { Document } from 'mongoose';
import { GeoJSON, GeoJsonObject } from 'geojson';

export interface IDriver extends Document{
    driverId: string;
    name: string;
    email : string;
    password: string;
    balance : number;
    status : boolean;
    driveLoc : GeoJsonObject;
    comparePassword: (password: string) => Promise<boolean>; 
    encryptPassword: (password: string) => Promise<string>;
}