import { Injectable , Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GeoJSON, GeoJsonObject } from 'geojson';
import { CreateTripCustomerDto } from './trip.dto';
import { Model } from 'mongoose';
import { ITrip } from './trip.interface';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
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
              "name": await convertCoordinatesToLocation(createTripCustomerDto.startPt[0], createTripCustomerDto.startPt[1])
            }
          }
        const endPt = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": createTripCustomerDto.endPt
            },
            "properties": {
                "name": await convertCoordinatesToLocation(createTripCustomerDto.endPt[0], createTripCustomerDto.endPt[1])
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

}

async function convertCoordinatesToLocation(latitude: number, longitude: number): Promise<string> {
    try {
      const response: AxiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_API_KEY ,
        },
      });
  
      const results = response.data.results;
      if (results.length > 0) {
        const formattedAddress = results[0].formatted_address;
        return formattedAddress;
      } else {
        throw new Error('No results found for the provided coordinates.');
      }
    } catch (error) {
      console.error('Error converting coordinates to location:', error.message);
      throw error;
    }
}