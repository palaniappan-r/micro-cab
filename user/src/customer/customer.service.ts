import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto , UpdateCustomerDto } from './dto/create.customer.dto';
import { ICustomer } from './customer.interface';
import { Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private customerModel:Model<ICustomer>) {}

    public async getCustomerById(customerId : string) : Promise<ICustomer> {
        const existingCustomer = await this.customerModel.findById(customerId)
        return existingCustomer
    }

    public async createCustomer(createCustomerReq : CreateCustomerDto) : Promise<ICustomer> {
        const newCustomer = await new this.customerModel(createCustomerReq);
        newCustomer.balance = 0;
        newCustomer.customerId = uuidv4();
        return newCustomer.save();
    }

    public async updateCustomerById(updateCustomerReq : UpdateCustomerDto , customerId : string) : Promise<ICustomer> {
        const customerObject = await this.customerModel.findOne({'customerId' : customerId})
        if(customerObject){
            const updatedCustomer = await this.customerModel.findByIdAndUpdate(customerObject._id , updateCustomerReq)
            return updatedCustomer.save()
        }
    }

    public async deleteCustomerById(customerId : any) : Promise<ICustomer> {
        const customerObject = await this.customerModel.findOne({customerId : customerId})
        if(customerObject){
            const deletedCustomer = await this.customerModel.findByIdAndDelete(customerObject._id)
            return deletedCustomer
        }
    }
}
