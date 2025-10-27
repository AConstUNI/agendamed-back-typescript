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
    private readonly doctorRegisterRepository: Repository<DoctorRegister>,
    private usersService: UsersService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    const user = await this.usersService.create({
      name: createDoctorDto.name,
      email: createDoctorDto.email,
      password: hashedPassword,
      role: UserRole.DOCTOR,
    });

    const doctor = this.doctorRegisterRepository.create({
      crm: createDoctorDto.crm,
      specialty: createDoctorDto.specialty,
      phone: createDoctorDto.phone,
      userId: user.id,
    });

    return this.doctorRegisterRepository.save(doctor);
  }

  async findByUserId(userId: number) {
    return this.doctorRegisterRepository.findOne({
        where: { userId },
        relations: ['user'], // opcional, retorna também os dados do usuário
    });
  }
}
