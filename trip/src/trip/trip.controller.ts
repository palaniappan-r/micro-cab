import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TripService } from './trip.service';
import { CreateTripCustomerDto } from './trip.dto';
import { ITrip } from './trip.interface';

@Controller('trip')
export class TripController {
    constructor(private readonly tripService: TripService) { }

    @MessagePattern('create_trip_cust')
    public async getAllCustomers(createTripCustomerDto : any) : Promise<CreateTripCustomerDto> {
    const newTrip = await this.tripService.createTripCustomer(createTripCustomerDto)
    return newTrip
  }

  @MessagePattern('get_open_trips')
  public async getOpenTrips() : Promise<any> {
    const openTrips = this.tripService.getOpenTrips()
    return openTrips 
  }
}