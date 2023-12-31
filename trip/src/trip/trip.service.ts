import { Injectable , Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GeoJSON, GeoJsonObject } from 'geojson';
import { AcceptTripDriverDto, CancelTripDriverDto, CreateTripCustomerDto, EndTripDriverDto, GetOpenTripsDto, UpdateTripCustomerDto } from './trip.dto';
import { AnyObject, Model } from 'mongoose';
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

  public async createTripCustomer(createTripCustomerDto : CreateTripCustomerDto) : Promise<ITrip>{
      try{
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
          
          if(!customerObj){
            throw new Error("No Customer Found")
          }

          newTrip.customer = customerObj
          newTrip.startPt = startPt
          newTrip.endPt = endPt
          newTrip.tripId = uuidv4();
          newTrip.openStatus = true
          newTrip.endStatus = false 
          newTrip.createdAt = new Date()
          newTrip.updatedAt = new Date()

          await getRoadDistance(startPt.geometry.coordinates[0], startPt.geometry.coordinates[1], endPt.geometry.coordinates[0], endPt.geometry.coordinates[1])
          .then((distance: number) => {
              newTrip.distance = distance
          })
          .catch((error: Error) => {
              console.error('Failed to retrieve road distance:', error);
          });

          newTrip.save()

          return newTrip
      } catch(error) {
          console.error(error.message);
          throw error;
      }
  }

  public async updateTripCustomer(updateTripCustomerDto : UpdateTripCustomerDto) : Promise<ITrip>{
    try{
        console.log(updateTripCustomerDto)
        const existingTrip : any = await this.tripModel.findOne({'tripId' : updateTripCustomerDto.tripId});

        if(existingTrip.customer.customerId !== updateTripCustomerDto.customerId){
            throw new Error("Customer not authorized to edit trip")
        }

        const startPt = {
            "type": "Feature",
            "geometry": {
            "type": "Point",
            "coordinates": updateTripCustomerDto.startPt
            },
            "properties": {
            "name": await convertCoordinatesToLocation(updateTripCustomerDto.startPt[0], updateTripCustomerDto.startPt[1])
            }
        }
        const endPt = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": updateTripCustomerDto.endPt
            },
            "properties": {
                "name": await convertCoordinatesToLocation(updateTripCustomerDto.endPt[0], updateTripCustomerDto.endPt[1])
            }
        }
        
        if(startPt || endPt){
            existingTrip.startPt = startPt
            existingTrip.endPt = endPt
            existingTrip.updatedAt = new Date()
            
            await getRoadDistance(startPt.geometry.coordinates[0], startPt.geometry.coordinates[1], endPt.geometry.coordinates[0], endPt.geometry.coordinates[1])
            .then((distance: number) => {
                existingTrip.distance = distance
            })
            .catch((error: Error) => {
                console.error('Failed to retrieve road distance:', error);
            });
        }

        existingTrip.save()

        return existingTrip
    } catch(error) {
        console.error(error.message);
        throw error;
    }
  }
    
  public async getOpenTripsDriver(getOpenTripsDto : GetOpenTripsDto) : Promise<ITrip[]>{
      try{
          const tripObject : ITrip[] = await this.tripModel.find({})
          const driverObj = await firstValueFrom(this.userService.send("get_driver" , getOpenTripsDto.driverId))

          const availableTrips : ITrip[] = []
          for(let i of tripObject){
            let driverDistance = -1
          
            await getRoadDistance(i.startPt.geometry.coordinates[0], i.startPt.geometry.coordinates[1], driverObj.driveLoc[0], driverObj.driveLoc[1])
            .then((distance: number) => {
                driverDistance = distance
            })
            .catch((error: Error) => {
                console.error('Failed to retrieve road distance:', error);
            });

            if(driverDistance < getOpenTripsDto.radius){
              availableTrips.push(i)
            }
          }

          return availableTrips
      }
      catch(error){
          console.error('Error accessing database', error.message);
          throw error;
      }
  }
  
  public async acceptTripDriver(acceptTripDriverDto : AcceptTripDriverDto) : Promise<ITrip>{
    try{
      const tripObject : any = await this.tripModel.findOne({'tripId' : acceptTripDriverDto.tripId});  
      const driverObj = await firstValueFrom(this.userService.send("get_driver" , acceptTripDriverDto.driverId))

        if(!driverObj){
          throw new Error("Driver does not exist")
        }

        if(!tripObject){
          throw new Error("Trip does not exist")
        }

        if(!tripObject.openStatus){
          throw new Error("Already assigned a driver")
        }

        tripObject.driver = driverObj
        tripObject.openStatus = false
        tripObject.endStatus = false
        tripObject.price = acceptTripDriverDto.price

        tripObject.save()

        return tripObject
    }
    catch(error){
        console.error('Error accessing database', error.message);
        throw error;
    }
  }

  public async cancelTripDriver(cancelTripDriverDto : CancelTripDriverDto) : Promise<ITrip>{
    try{
      const tripObject : any = await this.tripModel.findOne({'tripId' : cancelTripDriverDto.tripId})
      const driverObj = await firstValueFrom(this.userService.send("get_driver" , cancelTripDriverDto.driverId))

      if(!driverObj){
        throw new Error("Driver does not exist")
      }

      if(!tripObject){
        throw new Error("Trip does not exist")
      }
      
      if(tripObject.driver.driverId !== driverObj.driverId){
        throw new Error("Driver is not assigned to the trip")
      }

      tripObject.driver = undefined
      tripObject.save()

      return tripObject
    }
    catch(error){
      console.error('Error accessing database' , error.message);
      throw error
    }
  }

  public async endTripDriver(endTripDriverDto : EndTripDriverDto) : Promise<ITrip>{
    try{
      const tripObject : any = await this.tripModel.findOne({'tripId' : endTripDriverDto.tripId})
      const driverObj = await firstValueFrom(this.userService.send("get_driver" , endTripDriverDto.driverId))

      if(!driverObj){
        throw new Error("Driver does not exist")
      }

      if(!tripObject){
        throw new Error("Trip does not exist")
      }
      
      if(tripObject.driver.driverId !== driverObj.driverId){
        throw new Error("Driver is not assigned to the trip")
      }

      tripObject.endStatus = true
      tripObject.openStatus = false

      tripObject.save()

      return tripObject
    }
    catch(error){
      console.error('Error accessing database' , error.message);
      throw error
    }
  }
}



async function convertCoordinatesToLocation(latitude: number, longitude: number): Promise<string> {
    try {
      const response: AxiosResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_API_KEY
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

async function getRoadDistance(originLatitude: number, originLongitude: number, destinationLatitude: number, destinationLongitude: number): Promise<number> {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${originLatitude},${originLongitude}`,
          destinations: `${destinationLatitude},${destinationLongitude}`,
          key: process.env.GOOGLE_API_KEY
        },
      });
      console.log()
      if(response.data.rows[0].elements[0].distance.value){
        const distance = response.data.rows[0].elements[0].distance.value;
        return distance;
      }
      else{
        throw new Error("Failed to calculate distance")
      }
    } catch (error) {
      console.error('Error retrieving road distance:', error.message);
      throw error;
    }
  }