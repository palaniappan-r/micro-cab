import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { ICustomer } from './customer.interface';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

  @MessagePattern('get_cust')
  public async getCustomerById() : Promise<string> {
    return "User cust microservice running"
  }

  @MessagePattern('create_cust')
  public async createCustomer(createCustomerDto : CreateCustomerDto) : Promise<ICustomer> {
    const newCustomer = await this.customerService.createCustomer(createCustomerDto)
    newCustomer.save()
    return newCustomer
  }

}