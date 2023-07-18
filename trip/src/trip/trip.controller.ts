import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TripService } from './trip.service';
import { CreateTripCustomerDto, UpdateTripCustomerDto } from './trip.dto';
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
    const editedTrip = await this.tripService.updateTripCustomer(updateTripCustomerDto)
    return editedTrip
  }

  @MessagePattern('get_open_trips')
  public async getOpenTrips() : Promise<any> {
    const openTrips = this.tripService.getOpenTripsDriver()
    return openTrips 
  }
}