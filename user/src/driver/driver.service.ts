import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDriverDto , UpdateDriverDto } from './driver.dto';
import { IDriver } from './driver.interface';
import { Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { firstValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { GeoJsonTypes } from 'geojson';

@Injectable()
export class DriverService {
    constructor(
        @InjectModel('Driver') private driverModel:Model<IDriver>,
        @Inject('TOKEN_SERVICE') private readonly tokenService: ClientProxy
        ) {}

    public async getAllDrivers() : Promise<IDriver[]> {
        const driverObject = await this.driverModel.find({})
        return driverObject
    }

    //To-Do : only return driver in a set km radius
    public async getOpenDrivers(radius : number , currentLoc : any) : Promise<IDriver[]> {
        const driverObject = await this.driverModel.find({'status' : true})
        return driverObject
    }

    public async getDriverById(driverId : string) : Promise<IDriver> {
        const driverObject = await this.driverModel.findOne({'driverId' : driverId})
        return driverObject
    }

    public async createDriver(createDriverReq : CreateDriverDto) : Promise<IDriver> {
        const newDriver = await new this.driverModel(createDriverReq);
        newDriver.balance = 0;
        newDriver.driverId = uuidv4();
        return newDriver.save();
    }

    public async updateDriverById(updateDriverReq : UpdateDriverDto , driverId : string) : Promise<IDriver> {
        const driverObject = await this.driverModel.findOne({'driverId' : driverId})
        if(driverObject){
            const updatedDriver = await this.driverModel.findByIdAndUpdate(driverObject._id , updateDriverReq)
            return updatedDriver.save()
        }
    }

    public async deleteDriverById(driverId : any) : Promise<IDriver> {
        const driverObject = await this.driverModel.findOne({driverId : driverId})
        if(driverObject){
            const deletedDriver = await this.driverModel.findByIdAndDelete(driverObject._id)
            return deletedDriver
        }
    }

    public async loginDriver(driverId : string) : Promise<any> {
        const token = await firstValueFrom(this.tokenService.send("create_token" , [driverId , "driver"]))
        return (token)
    }
}
