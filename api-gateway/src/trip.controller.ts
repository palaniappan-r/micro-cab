import { Controller, Get , Inject , Post, Put ,Res , Body , HttpStatus} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('trip')
export class TripController {
  constructor(
    @Inject('TRIP_SERVICE') private readonly tripServiceClient: ClientProxy
    ) {}

  @Post('/create')
  public async createTripCustomer(@Res() response, @Body() createTripCustomerDto) : Promise<any>{
    const data = await firstValueFrom(this.tripServiceClient.send('create_trip_cust' , createTripCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been created successfully', data
        });
    }
  }

  @Get('/open')
  public async getOpenTrips(@Res() response) : Promise<any>{
    const data = await firstValueFrom(this.tripServiceClient.send('get_open_trips' , ""))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been created successfully',
        data
        });
    }
  }

  @Put('/update')
  public async updateTripCustomer(@Res() response , @Body() updateTripCustomerDto) : Promise<any> {
    const data = await firstValueFrom(this.tripServiceClient.send('update_trip_cust' , updateTripCustomerDto))
  {
    return response.status(HttpStatus.CREATED).json({
      message: 'Trip has been updated successfully',
      data
      });
  }
  }
}
