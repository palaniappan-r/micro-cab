import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { DriverSchema } from './driver.schema';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

import * as dotenv from 'dotenv';

const tokenServicePort = parseInt(process.env.TOKEN_SERVICE_PORT) || 3012;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema}]),
    ClientsModule.register([
      { name: 'TOKEN_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: tokenServicePort } }
    ]),
    DriverModule],
  providers: [DriverService],
  controllers: [DriverController]
})
export class DriverModule {}
