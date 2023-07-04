import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: '0.0.0.0', port: 3011 } }
    ])
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}

