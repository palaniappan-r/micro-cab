import { Controller, Get , Inject , Post, Put ,Res , Body , HttpStatus} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { HasRoles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
import { RolesGuard } from './auth/role.guard';

import { AuthGuard } from '@nestjs/passport';


@Controller('trip')
export class TripController {
  constructor(
    @Inject('TRIP_SERVICE') private readonly tripServiceClient: ClientProxy
    ) {}
  
  @HasRoles(Role.CUSTOMER)
  @Post('/create')
  public async createTripCustomer(@Res() response, @Body() createTripCustomerDto) : Promise<any>{
    const data = await firstValueFrom(this.tripServiceClient.send('create_trip_cust' , createTripCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been created successfully', data
        });
    }
  }
  
  @HasRoles(Role.DRIVER)
  @Get('/open')
  public async getOpenTrips(@Res() response) : Promise<any>{
    const data = await firstValueFrom(this.tripServiceClient.send('get_open_trips' , ""))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been found successfully',
        data
        });
    }
  }

  @HasRoles(Role.CUSTOMER)
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
