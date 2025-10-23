// src/doctors/doctors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorRegister } from './entities/doctor-register.entity';
import { UsersService } from '../usuarios/usuarios.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { AdminLogService } from 'src/admin-log/admin-log.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorRegister)
    private doctorRepository: Repository<DoctorRegister>,
    private usersService: UsersService,
    private readonly adminLogService: AdminLogService
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const user = await this.usersService.createWithRole(
      {
        name: createDoctorDto.name,
        email: createDoctorDto.email,
        password: createDoctorDto.password,
      },
      UserRole.DOCTOR,
    );
    
    const doctor = this.doctorRepository.create({
      crm: createDoctorDto.crm,
      specialty: createDoctorDto.specialty,
      phone: createDoctorDto.phone,
      userId: user.id,
    });

    // Log the action
    await this.adminLogService.create(
      'admin@place.holder',
      'CREATE_DOCTOR',
      createDoctorDto.name,
    );

    return this.doctorRepository.save(doctor);
  }

  async findByUserId(userId: number) {
    return this.doctorRepository.findOne({
      where: { userId },
      relations: ['user'], // opcional, retorna também os dados do usuário
    });
  }
  async findByUserName(name: string) {
    return this.doctorRepository.findOne({
      relations: ['user'], // opcional, retorna também os dados do usuário
      where: { user: { name } },
    });
  }
  async findByUserSpecialty(specialty: string) {
    return this.doctorRepository.findOne({
      where: { specialty },
      relations: ['user'], // opcional, retorna também os dados do usuário
    });
  }
}
