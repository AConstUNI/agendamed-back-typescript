import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { DoctorRegister } from '../doctors/entities/doctor-register.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AdminLogService } from 'src/admin-log/admin-log.service';

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentoRepository: Repository<Agendamento>,

    @InjectRepository(DoctorRegister)
    private readonly doctorRepository: Repository<DoctorRegister>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly adminLogService: AdminLogService
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

    // Log the action
    await this.adminLogService.create(
      dto.who || 'Unknown Attendant',
      'CREATE_APPOINTMENT',
      await this.userRepository.findOne({
        where: {
          id: dto.pacienteId
        }
      }).then((v) => v?.email) || 'Unknown User'
    );

    const agendamento = this.agendamentoRepository.create(dto);
    return this.agendamentoRepository.save(agendamento);
  }

  async delete(id: number, who?: string): Promise<void> {
    const agendamento = await this.agendamentoRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado.');
    }

    // Log the action
    await this.adminLogService.create(
      who || 'Unknown Attendant',
      'DELETE_APPOINTMENT',
      agendamento.paciente?.email || 'Unknown User'
    );

    await this.agendamentoRepository.remove(agendamento);
  }

  findAll(): Promise<Agendamento[]> {
    return this.agendamentoRepository.find({ 
      relations: ['paciente', 'medico', 'medico.user'],
      order: {
        data: 'ASC',
        hora: 'ASC',
      },
    });
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

    // Data e hora atual
    const agora = new Date();

    // QueryBuilder para fazer comparação de data e hora
    const query = this.agendamentoRepository.createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.paciente', 'paciente')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .leftJoinAndSelect('medico.user', 'user')
      .where('1=1'); // placeholder para encadear condições

    if (pacienteId) {
      query.andWhere('agendamento.pacienteId = :pacienteId', { pacienteId });
    }

    if (userIdMedico) {
      const doctor = await this.doctorRepository.findOne({ where: { userId: userIdMedico } });
      if (!doctor) {
        throw new Error('Usuário médico não possui registro de DoctorRegister');
      }
      query.andWhere('agendamento.medicoId = :medicoId', { medicoId: doctor.id });
    }

    // Filtrar agendamentos que já passaram
    query.andWhere('(agendamento.data > :hoje OR (agendamento.data = :hoje AND agendamento.hora >= :horaAtual))', {
      hoje: agora.toISOString().split('T')[0],       // yyyy-mm-dd
      horaAtual: agora.toTimeString().substring(0,5),  // HH:mm
    });

    // Ordenar
    query.orderBy('agendamento.data', 'ASC')
        .addOrderBy('agendamento.hora', 'ASC');

    return query.getMany();
  }
}
