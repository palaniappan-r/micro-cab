import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { ICustomer } from './customer.interface';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create.customer.dto';
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

  @MessagePattern('update_cust')
  public async updateCustomerById(payload){
    const updateCustomer = await this.customerService.updateCustomerById(payload[0], payload[1])
    return updateCustomer
  }

  @MessagePattern('delete_cust')
  public async deleteCustomerById(customerId : string) : Promise<ICustomer> {
    const deletedCustomer = await this.customerService.deleteCustomerById(customerId)
    return deletedCustomer
  }

}