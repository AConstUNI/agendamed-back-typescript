// src/agendamento/agendamento.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';
import { Agendamento } from './entities/agendamento.entity';
import { DoctorRegister } from '../doctors/entities/doctor-register.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento, DoctorRegister]),
  ],
  controllers: [AgendamentoController],
  providers: [AgendamentoService],
})
export class AgendamentoModule {}
