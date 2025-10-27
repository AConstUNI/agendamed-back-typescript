// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { User } from './usuarios/entities/usuario.entity';
import { DoctorRegister } from './doctors/entities/doctor-register.entity';
import { AdminLogModule } from './admin-log/admin-log.module';
import { AdminLog } from './admin-log/entities/admin-log.entity';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { Agendamento } from './agendamento/entities/agendamento.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carrega variáveis de ambiente
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // fallback
      port: parseInt(process.env.DB_PORT || '5432'), // fallback
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'nestdb',
      entities: [User, DoctorRegister, Agendamento, AdminLog],
      synchronize: true,
    }),
    UsuariosModule,
    AuthModule,
    DoctorsModule,
    AdminLogModule,
    AgendamentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
