import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDriverDto , UpdateDriverDto } from './driver.dto';
import { IDriver } from './driver.interface';
import { Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { firstValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { GeoJsonObject, GeoJsonTypes } from 'geojson';

import * as bcrypt from 'bcrypt';

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
        console.log(driverId)
        const driverObject = await this.driverModel.findOne({'driverId' : driverId})
        console.log(driverObject)
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
            updatedDriver.save()
            return updatedDriver
        }
    }

    public async deleteDriverById(driverId : any) : Promise<IDriver> {
        const driverObject = await this.driverModel.findOne({driverId : driverId})
        if(driverObject){
            const deletedDriver = await this.driverModel.findByIdAndDelete(driverObject._id)
            return deletedDriver
        }
    }

    public async loginDriver(driverId : string , password : string) : Promise<any> {
        //To-Do : add appropriate try catch blocks everywhere
        const driverObject = await this.driverModel.findOne({driverId : driverId})
        const flag = await (bcrypt.compare(password  , driverObject.password))
        if(flag){
            const token = await firstValueFrom(this.tokenService.send("create_token" , [driverObject.driverId , "driver"]))
            return (token)
        }
        else{
            console.error("Wrong Password")
        }
    }

    public async updateLocation(driverCurrentLocation : number[] , driverId : string) : Promise<any> {
        const driverObject = await this.driverModel.findOne({driverId : driverId})
        if(driverObject){
            driverObject.driveLoc = driverCurrentLocation
        }
        return driverObject.save()
    }
}
