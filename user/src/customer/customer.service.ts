import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { ICustomer } from './customer.interface';
import { Model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private customerModel:Model<ICustomer>) {}

    public async createCustomer(createCustomerDto : CreateCustomerDto) : Promise<ICustomer> {
        const newCustomer = await new this.customerModel(createCustomerDto);
        newCustomer.balance = 0;
        newCustomer.customerId = uuidv4();
        return newCustomer.save();
    }
}
