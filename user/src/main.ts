import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';

const userServicePort = parseInt(process.env.USER_SERVICE_PORT) || 3011;

let PORT = userServicePort
let HOST = '0.0.0.0'
async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: { host: HOST, port: PORT }
  });
  app.useGlobalPipes(new ValidationPipe());
  app.listen();

  console.log(`User Microservice on ${HOST}:${PORT}`)
}
bootstrap();