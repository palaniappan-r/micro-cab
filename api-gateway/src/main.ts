import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {

  let PORT = process.env.API_GATEWAY_PORT || 8000
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`API Gateway running at port ${PORT}`)
}
bootstrap();
