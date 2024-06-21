import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalPipes(new ZodValidationPipe());

  // Todo: configure CORS it with environment variables
  app.enableCors();

  const config = app.get(ConfigService);
  console.log(config);
  await app.listen(config.get('server.port')!);
  console.log(
    `ProSeM | Server Running at ${process.env.PORT} \n Enviroment ===>  ${process.env.NODE_ENV}`,
  );
}
bootstrap();
