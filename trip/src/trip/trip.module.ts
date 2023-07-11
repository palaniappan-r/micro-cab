import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripSchema } from './trip.schema';

import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema}]), 
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: 3011 } }
    ]),
    TripModule],
  providers: [TripService],
  controllers: [TripController]

})
export class TripModule {}




