import { Injectable , Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GeoJSON, GeoJsonObject } from 'geojson';
import { CreateTripCustomerDto } from './trip.dto';
import { Model } from 'mongoose';
import { ITrip } from './trip.interface';
import { firstValueFrom } from 'rxjs';

import {v4 as uuidv4} from 'uuid';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TripService {
    constructor(
        @InjectModel('Trip') private tripModel:Model<ITrip>,
        @Inject('USER_SERVICE') private readonly userService: ClientProxy
        ) {}
    public async createTripCustomer(createTripCustomerDto : CreateTripCustomerDto) : Promise<any>{
        const startPt = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": createTripCustomerDto.startPt
            },
            "properties": {
              "name": "Dinagat Islands 1"
            }
          }
        const endPt = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": createTripCustomerDto.endPt
            },
            "properties": {
                "name": "Dinagat Islands 2"
            }
        }
        
        const newTrip = await new this.tripModel();
        const customerObj = await firstValueFrom(this.userService.send("get_cust" , createTripCustomerDto.customerId))
        if(customerObj){
            newTrip.customer = customerObj
            newTrip.startPt = startPt
            newTrip.endPt = endPt
            newTrip.tripId = uuidv4();
            newTrip.status = true
        }
        else{
            throw new Error("No Customer Found")
        }

        newTrip.save()

        return newTrip
    }
    public async getOpenTrips() : Promise<any>{
        return "works"
    }
}
