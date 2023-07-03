import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TokenModule } from './token.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.TCP,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.listen();
}
bootstrap();