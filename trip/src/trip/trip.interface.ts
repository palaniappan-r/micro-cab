import { Document } from 'mongoose';
import { GeoJsonObject } from 'geojson';

export interface ITrip extends Document{
    tripId: string
    customer: object
    driver: object;
    startPt : GeoJsonObject;
    endPt : GeoJsonObject;
    distance : number;
    price : number;
    createdAt : Date;
    updatedAt : Date;
    status : boolean
}