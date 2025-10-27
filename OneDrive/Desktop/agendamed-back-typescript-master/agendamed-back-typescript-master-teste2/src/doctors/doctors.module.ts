// src/doctors/doctors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorRegister } from './entities/doctor-register.entity';
import { UsersModule } from '../usuarios/usuarios.module';
import { UsersService } from 'src/usuarios/usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorRegister]), UsersModule],
  providers: [DoctorsService],
  controllers: [DoctorsController],
})
export class DoctorsModule {

}

