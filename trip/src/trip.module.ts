import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
