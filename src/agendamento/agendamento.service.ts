import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { DoctorRegister } from '../doctors/entities/doctor-register.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentoRepository: Repository<Agendamento>,

    @InjectRepository(DoctorRegister)
    private readonly doctorRepository: Repository<DoctorRegister>,
  ) {}

  async create(dto: CreateAgendamentoDto): Promise<Agendamento> {
    const medicoOcupado = await this.agendamentoRepository.findOne({
      where: {
        medicoId: dto.medicoId,
        data: dto.data,
        hora: dto.hora,
      },
    });

    if (medicoOcupado) {
      throw new Error('Médico já possui agendamento nesse horário.');
    }

    const agendamento = this.agendamentoRepository.create(dto);
    return this.agendamentoRepository.save(agendamento);
  }

  findAll(): Promise<Agendamento[]> {
    return this.agendamentoRepository.find({ relations: ['paciente', 'medico'] });
  }

  async getMedicosDisponiveis(data: string, hora: string): Promise<DoctorRegister[]> {
    const todosMedicos = await this.doctorRepository.find({ relations: ['user'] });
    const agendamentos = await this.agendamentoRepository.find({
      where: { data, hora },
    });

    const ocupadosIds = agendamentos.map((a) => a.medicoId);
    return todosMedicos.filter((medico) => !ocupadosIds.includes(medico.id));
  }

  async findByUserOrMedico(pacienteId?: number, userIdMedico?: number): Promise<Agendamento[]> {
    if (!pacienteId && !userIdMedico) {
      throw new Error('É necessário fornecer pacienteId ou userId do médico para filtrar agendamentos.');
    }

    const where: any[] = [];

    if (pacienteId) {
      where.push({ pacienteId });
    }

    if (userIdMedico) {
      // usa o doctorRepository que você já tem
      const doctor = await this.doctorRepository.findOne({ where: { userId: userIdMedico } });
      if (!doctor) {
        throw new Error('Usuário médico não possui registro de DoctorRegister');
      }
      where.push({ medicoId: doctor.id });
    }

    return this.agendamentoRepository.find({
      where,
      relations: ['paciente', 'medico'],
      order: { data: 'ASC', hora: 'ASC' },
    });
  }
}
