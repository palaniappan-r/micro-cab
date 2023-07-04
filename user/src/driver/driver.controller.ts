import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { IDriver } from './driver.interface';
import { CreateDriverDto, UpdateDriverDto } from './driver.dto';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
    constructor(
      private readonly driverService: DriverService,
      ) { }

  @MessagePattern('get_all_drivers')
  public async getAllDrivers() : Promise<any> {
    const allDrivers : IDriver[] = await this.driverService.getAllDrivers()
    return allDrivers
  }

  @MessagePattern('get_driver')
  public async getDriverById(driverId : string) : Promise<IDriver> {
    const existingDriver = await this.driverService.getDriverById(driverId)
    return existingDriver
  }

  @MessagePattern('create_driver')
  public async createDriver(createDriverDto : CreateDriverDto) : Promise<IDriver> {
    const newDriver = await this.driverService.createDriver(createDriverDto)
    newDriver.save()
    return newDriver
  }

  @MessagePattern('update_driver')
  //To-Do : add type for payload here
  public async updateDriverById(payload) : Promise<IDriver>{
    const updateDriver = await this.driverService.updateDriverById(payload[0], payload[1])
    return updateDriver
  }

  @MessagePattern('delete_driver')
  public async deleteDriverById(driverId : string) : Promise<IDriver> {
    const deletedDriver = await this.driverService.deleteDriverById(driverId)
    return deletedDriver
  }
  
  @MessagePattern('login_driver')
  public async loginDriver(driverId : string) : Promise<any> {
    const token = await this.driverService.loginDriver(driverId)
    return token
  }

}