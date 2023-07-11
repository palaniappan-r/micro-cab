import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerSchema } from './customer.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema}]),
    ClientsModule.register([
      { name: 'TOKEN_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: 3012 } }
    ]),
    CustomerModule],
  providers: [CustomerService],
  controllers: [CustomerController]
})
export class CustomerModule {}
