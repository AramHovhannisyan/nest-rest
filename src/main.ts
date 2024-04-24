import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

async function start() {
  const app = await NestFactory.create(AppModule);

  /* Documentize App */
  const config = new DocumentBuilder()
    .setTitle('Nest Rest API')
    .setDescription('Nest Rest API description')
    .setVersion('1.0')
    .addTag('rest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server Started On Port: ${PORT}`));
}
start();
