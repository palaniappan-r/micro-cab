import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  let PORT = 3214

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`API Gateway running at port ${PORT}`)
}
bootstrap();
