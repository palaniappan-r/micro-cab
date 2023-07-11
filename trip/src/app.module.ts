import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/uber-clone'), TripModule],
})
export class AppModule {}
