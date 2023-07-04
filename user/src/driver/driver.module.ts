import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { DriverSchema } from './driver.schema';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema}]),
    ClientsModule.register([
      { name: 'TOKEN_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: 3012 } }
    ]),
    DriverModule],
  providers: [DriverService],
  controllers: [DriverController]
})
export class DriverModule {}
