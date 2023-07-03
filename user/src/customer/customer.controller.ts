import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { ICustomer } from './customer.interface';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create.customer.dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

  @MessagePattern('get_all_cust')
  public async getAllCustomers() : Promise<ICustomer[]> {
    const allCustomers : ICustomer[] = await this.customerService.getAllCustomers()
    return allCustomers
  }

  @MessagePattern('get_cust')
  public async getCustomerById(customerId : string) : Promise<ICustomer> {
    const existingCustomer = await this.customerService.getCustomerById(customerId)
    return existingCustomer
  }

  @MessagePattern('create_cust')
  public async createCustomer(createCustomerDto : CreateCustomerDto) : Promise<ICustomer> {
    const newCustomer = await this.customerService.createCustomer(createCustomerDto)
    newCustomer.save()
    return newCustomer
  }

  @MessagePattern('update_cust')
  //To-Do : add type for payload here
  public async updateCustomerById(payload) : Promise<ICustomer>{
    const updateCustomer = await this.customerService.updateCustomerById(payload[0], payload[1])
    return updateCustomer
  }

  @MessagePattern('delete_cust')
  public async deleteCustomerById(customerId : string) : Promise<ICustomer> {
    const deletedCustomer = await this.customerService.deleteCustomerById(customerId)
    return deletedCustomer
  }

}