import { Controller, Get , Inject , Post , Put , Delete, Res , Body , HttpStatus , Param, Query , UseGuards} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { response } from 'express';
import { firstValueFrom } from 'rxjs';

import { HasRoles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
import { RolesGuard } from './auth/role.guard';
import { UserService } from './auth/user.service';
import { AuthGuard } from '@nestjs/passport';

@HasRoles(Role.DRIVER)
@Controller('driver')
export class DriverController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private userService : UserService
    ) {}

  @Post('/create')
  public async createStudent(@Res() response, @Body() createDriverDto) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('create_driver' , createDriverDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver has been created successfully',
        data});
    }
  }

  @Post('/login')
  public async test(@Res() response , @Body() loginDto : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('login_driver' , [loginDto.driverId , loginDto.password]))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Driver has been logged in',
        data});
    }
  }
  
  @UseGuards(AuthGuard('jwt') , RolesGuard)
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
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Get('/findOpen')
  public async getOpenDrivers(@Res() response): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_open_drivers' , ""))
    {
        return response.status(HttpStatus.FOUND).json({
            message: 'Drivers have been found',
            data});
    }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Get('/getById')
  public async getDriver(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_driver' , params.driverId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Driver has been found',
        data});
    }
  }

  // @UseGuards(AuthGuard('jwt') , RolesGuard)
  // @Post('/updateLocation')
  // public async updateDriverLocation(@Res() response, @Body() currentLocation) : Promise<any>{
  //   let data = await firstValueFrom(this.userServiceClient.send('update_location' , currentLocation))
  //   console.log(data)
  //   {
  //     return response.status(HttpStatus.CREATED).json({
  //       message: 'Driver location has been updated successfully',
  //       data});
  //   }
  // }

  //To-Do : only update the logged in user
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Put('/update')
  public async updateDriverById(@Res() response, @Body() updateDriverDto , @Query() params : any) : Promise<any>{
    const user = this.userService.getUser()
    const payload = [updateDriverDto , user.userId]
    let data = await firstValueFrom(this.userServiceClient.send('update_driver' , payload))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver has been updated successfully',
        data});
    }
  }

  //To-Do : Chk if user is logged in first
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Delete('/delete')
  public async deleteDriverBuId(@Res() response, @Query() params : any) : Promise<any>{
    const user = this.userService.getUser()
    let data = await firstValueFrom(this.userServiceClient.send('delete_driver' , user.userId))
    {
      return response.status(HttpStatus.CONTINUE).json({
        message: 'Driver has been deleted successfully',
        data});
    }
  }
}
