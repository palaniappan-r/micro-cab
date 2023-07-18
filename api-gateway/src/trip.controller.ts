import { Controller, Get , Inject , Post, Put ,Res , Body , HttpStatus , UseGuards, Delete} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { HasRoles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
import { RolesGuard } from './auth/role.guard';
import { UserService } from './auth/user.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('trip')
export class TripController {
  constructor(
    @Inject('TRIP_SERVICE') private readonly tripServiceClient: ClientProxy,
    private userService : UserService
    ) {}
 
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @HasRoles(Role.CUSTOMER)
  @Post('/create')
  public async createTripCustomer(@Res() response, @Body() createTripCustomerDto) : Promise<any>{
    const user = this.userService.getUser()
    createTripCustomerDto.customerId = user.userId

    const data = await firstValueFrom(this.tripServiceClient.send('create_trip_cust' , createTripCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been created successfully', data
        });
    }
  }
  
  @UseGuards(AuthGuard('jwt') , RolesGuard)
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

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @HasRoles(Role.CUSTOMER)
  @Put('/update')
  public async updateTripCustomer(@Res() response , @Body() updateTripCustomerDto) : Promise<any> {
    const user = this.userService.getUser()
    updateTripCustomerDto.customerId = user.userId

    const data = await firstValueFrom(this.tripServiceClient.send('update_trip_cust' , updateTripCustomerDto))
  {
    return response.status(HttpStatus.CREATED).json({
      message: 'Trip has been updated successfully',
      data
      });
  }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @HasRoles(Role.DRIVER)
  @Post('/accept')
  public async acceptTripDriver(@Res() response , @Body() acceptTripDriverDto) : Promise<any> {
    const user = this.userService.getUser()
    acceptTripDriverDto.driverId = user.userId

    const data = await firstValueFrom(this.tripServiceClient.send('accept_trip_driver' , acceptTripDriverDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message : 'Driver assigned to trip',
        data
      })
    }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @HasRoles(Role.DRIVER)
  @Delete('/end')
  public async endTripDriver(@Res() response , @Body() endTripDriverDto) : Promise<any> {
    const user = this.userService.getUser()
    endTripDriverDto.driverId = user.userId

    const data = await firstValueFrom(this.tripServiceClient.send('end_trip_driver' , endTripDriverDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message : 'Driver ended trip',
        data
      })
    }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @HasRoles(Role.DRIVER)
  @Delete('/cancel')
  public async cancelTripDriver(@Res() response , @Body() cancelTripDriverDto) : Promise<any> {
    const user = this.userService.getUser()
    cancelTripDriverDto.driverId = user.userId

    const data = await firstValueFrom(this.tripServiceClient.send('cancel_trip_driver' , cancelTripDriverDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message : 'Driver cancelled trip',
        data
      })
    }
  }
}
