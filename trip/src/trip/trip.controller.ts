import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TripService } from './trip.service';
import { AcceptTripDriverDto, CancelTripDriverDto, CreateTripCustomerDto, EndTripDriverDto, GetOpenTripsDto, UpdateTripCustomerDto } from './trip.dto';
import { ITrip } from './trip.interface';

@Controller('trip')
export class TripController {
    constructor(private readonly tripService: TripService) { }

  @MessagePattern('create_trip_cust')
  public async createTripCustomer(createTripCustomerDto : CreateTripCustomerDto) : Promise<ITrip> {
    const newTrip = await this.tripService.createTripCustomer(createTripCustomerDto)
    return newTrip
  }

  @MessagePattern('update_trip_cust')
  public async updateTripCustomer(updateTripCustomerDto : UpdateTripCustomerDto) : Promise<ITrip> {
    console.log(updateTripCustomerDto)
    const editedTrip = await this.tripService.updateTripCustomer(updateTripCustomerDto)
    return editedTrip
  }

  @MessagePattern('get_open_trips')
  public async getOpenTrips(getOpenTripsDto : GetOpenTripsDto) : Promise<ITrip[]> {
    const openTrips = this.tripService.getOpenTripsDriver(getOpenTripsDto)
    return openTrips 
  }

  @MessagePattern('accept_trip_driver')
  public async acceptTripDriver(acceptTripDriverDto : AcceptTripDriverDto) : Promise<ITrip>{
    const tripObj = await this.tripService.acceptTripDriver(acceptTripDriverDto)
    return tripObj
  }

  @MessagePattern('cancel_trip_driver')
  public async cancelTripDriver(cancelTripDriverDto : CancelTripDriverDto) : Promise<ITrip>{
    const tripObj = await this.tripService.cancelTripDriver(cancelTripDriverDto)
    return tripObj
  }

  @MessagePattern('end_trip_driver')
  public async endTripDriver(endTripDriverDto : EndTripDriverDto) : Promise<ITrip>{
    const tripObj = await this.tripService.endTripDriver(endTripDriverDto)
    return tripObj
  }
}