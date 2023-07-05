import { Controller, Get , Inject , Post , Put , Delete, Res , Body , HttpStatus , Param, Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('driver')
export class DriverController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
    ) {}

  @Get('/login')
  public async test(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('login_driver' , params.driverId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Driver has been logged in',
        data});
    }
  }
  
  @Get('/getAll')
  public async getAllDrivers(@Res() response): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_all_drivers' , ""))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Drivers have been found',
        data});
    }
  }

  //To-Do : Add locationQueryDTO with current location and radius here
  @Get('/findOpenInRadius')
  public async getOpenDrivers(@Res() response): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_open_drivers' , ""))
    {
        return response.status(HttpStatus.FOUND).json({
            message: 'Drivers have been found',
            data});
    }
  }

  @Get('/findById')
  public async getDriver(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_driver' , params.driverId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Driver has been found',
        data});
    }
  }

  @Post('/create')
  public async createStudent(@Res() response, @Body() createDriverDto) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('create_driver' , createDriverDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver has been created successfully',
        data});
    }
  }

  @Post('/updateLocation')
  public async updateDriverLocation(@Res() response, @Body() currentLocation) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('update_location' , currentLocation))
    console.log(data)
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver location has been updated successfully',
        data});
    }
  }

  //To-Do : only update the logged in user
  @Put('/update')
  public async updateDriverById(@Res() response, @Body() updateDriverDto , @Query() params : any) : Promise<any>{
    //For now, the driverId is passed as a query param, later, it'll be taken from the auth cookie
    const payload = [updateDriverDto , params.driverId]
    let data = await firstValueFrom(this.userServiceClient.send('update_driver' , payload))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver has been updated successfully',
        data});
    }
  }

  //To-Do : Chk if user is logged in first
  @Delete('/delete')
  public async deleteDriverBuId(@Res() response, @Query() params : any) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('delete_driver' , params.driverId))
    {
      return response.status(HttpStatus.CONTINUE).json({
        message: 'Driver has been deleted successfully',
        data});
    }
  }
}