// src/doctors/doctors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorRegister } from './entities/doctor-register.entity';
import { UsersService } from '../usuarios/usuarios.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../usuarios/entities/usuario.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorRegister)
    private doctorRepository: Repository<DoctorRegister>,
    private usersService: UsersService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const user = await this.usersService.create({
      name: createDoctorDto.name,
      email: createDoctorDto.email,
      password: createDoctorDto.password,
      role: UserRole.DOCTOR,
    });

    const doctor = this.doctorRepository.create({
      crm: createDoctorDto.crm,
      specialty: createDoctorDto.specialty,
      phone: createDoctorDto.phone,
      userId: user.id,
    });

    return this.doctorRepository.save(doctor);
  }

  async findByUserId(userId: number) {
    return this.doctorRepository.findOne({
        where: { userId },
        relations: ['user'], // opcional, retorna também os dados do usuário
    });
  }
}
