import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';

import { Transport, ClientsModule } from '@nestjs/microservices';
import { DriverController } from './driver.controller';
import { TripController } from './trip.controller';

import * as dotenv from 'dotenv';
import { PassportModule, PassportSerializer } from '@nestjs/passport';

import { JwtStrategy } from './auth/jwt.strategy';

const userServicePort = parseInt(process.env.USER_SERVICE_PORT) || 3011;
const tripServicePort = parseInt(process.env.TRIP_SERVICE_PORT) || 3013;

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: userServicePort } },
      { name: 'TRIP_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: tripServicePort } }
    ])
  ],
  controllers: [CustomerController , DriverController , TripController],
  providers: [JwtStrategy],
})
export class AppModule {}

