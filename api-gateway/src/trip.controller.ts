import { Controller, Get , Inject , Post, Res , Body , HttpStatus} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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

}
