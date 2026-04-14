import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Sandbox OA API V1')
    .setVersion('1.0.0')
    .addTag('componentes')
    .addTag('repositórios')
    .addTag('env-mapping')
    .addTag('receita')
    .addTag('provisionamento')
    .addTag('sandbox')
    .addTag('execuções')
    .addTag('saúde')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(3000);
}

bootstrap();
