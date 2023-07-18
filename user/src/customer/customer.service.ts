import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto , UpdateCustomerDto } from './dto/create.customer.dto';
import { ICustomer } from './customer.interface';
import { Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { firstValueFrom } from 'rxjs';

import * as bcrypt from 'bcrypt';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel('Customer') private customerModel:Model<ICustomer>,
        @Inject('TOKEN_SERVICE') private readonly tokenService: ClientProxy
        ) {}

    public async getAllCustomers() : Promise<ICustomer[]> {
        const customerObject = await this.customerModel.find({})
        return customerObject
    }

    public async getCustomerById(customerId : string) : Promise<ICustomer> {
        const customerObject = await this.customerModel.findOne({'customerId' : customerId})
        return customerObject
    }

    public async createCustomer(createCustomerReq : CreateCustomerDto) : Promise<ICustomer> {
        const newCustomer = await new this.customerModel(createCustomerReq);
        newCustomer.balance = 100;
        newCustomer.customerId = uuidv4();
        return newCustomer.save();
    }

    public async updateCustomerById(updateCustomerReq : UpdateCustomerDto , customerId : string) : Promise<ICustomer> {
        const customerObject = await this.customerModel.findOne({'customerId' : customerId})
        if(customerObject){
            const updatedCustomer = await this.customerModel.findByIdAndUpdate(customerObject._id , updateCustomerReq)
            updatedCustomer.save()

            return updatedCustomer
        }
    }

    public async deleteCustomerById(customerId : any) : Promise<ICustomer> {
        const customerObject = await this.customerModel.findOne({customerId : customerId})
        if(customerObject){
            const deletedCustomer = await this.customerModel.findByIdAndDelete(customerObject._id)
            return deletedCustomer
        }
    }

    public async loginCustomer(customerId: string , password: string) : Promise<any> {
        //To-Do : add appropriate try catch blocks everywhere
        const customerObject : ICustomer = await this.customerModel.findOne({customerId : customerId})
        const flag = await (bcrypt.compare(password  , customerObject.password))
        if(flag){
            const token = await firstValueFrom(this.tokenService.send("create_token" , [customerObject.customerId , "customer"]))
            return (token)
        }
        else{
            console.error("Wrong Password")
        }
    }
}
