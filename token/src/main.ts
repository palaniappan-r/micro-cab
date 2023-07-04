import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TokenModule } from './token.module';
// import { ValidationPipe } from '@nestjs/common';

let PORT = 3012
let HOST = '0.0.0.0'
async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.TCP,
    options: { host: HOST, port: PORT }
  });
  // app.useGlobalPipes(new ValidationPipe());
  app.listen();

  console.log(`Token Microservice on ${HOST}:${PORT}`)
}
bootstrap();