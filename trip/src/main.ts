import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let PORT = 3013
let HOST = '0.0.0.0'
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host: HOST, port: PORT }
  });
  app.useGlobalPipes(new ValidationPipe());
  app.listen();

  console.log(`Trip Microservice on ${HOST}:${PORT}`)
}
bootstrap();