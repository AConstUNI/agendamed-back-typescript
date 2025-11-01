// src/agendamento/agendamento.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';
import { Agendamento } from './entities/agendamento.entity';
import { DoctorRegister } from '../doctors/entities/doctor-register.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AdminLogModule } from 'src/admin-log/admin-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento, DoctorRegister, User]),
    AdminLogModule
  ],
  controllers: [AgendamentoController],
  providers: [AgendamentoService],
})
export class AgendamentoModule {}
