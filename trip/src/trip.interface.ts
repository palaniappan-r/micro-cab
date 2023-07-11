import { DateUnit, Document } from 'mongoose';
import { GeoJSON, GeoJsonObject } from 'geojson';

export interface IDriver extends Document{
    tripId: string
    customerId: string
    driverId: string;
    startPt : GeoJsonObject;
    endPt : GeoJsonObject;
    distance : number;
    price : number;
    createdAt : Date;
    updatedAt : Date;
    status : boolean
}