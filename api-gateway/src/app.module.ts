import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';

import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: 3011 } }
    ])
  ],
  controllers: [CustomerController],
  providers: [],
})
export class AppModule {}

