import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../ormconfig';

async function bootstrap() {

 try {
    await AppDataSource.initialize();
    console.log('Conexão com PostgreSQL estabelecida!');
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 5000);
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
}

bootstrap();



