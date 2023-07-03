import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  controllers: [TokenController]
})
export class TokenModule {}
