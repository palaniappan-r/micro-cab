import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

// to interact with the microservices we created
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name : 'USER_SERVICE' , transport: Transport.TCP}
    ])
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
