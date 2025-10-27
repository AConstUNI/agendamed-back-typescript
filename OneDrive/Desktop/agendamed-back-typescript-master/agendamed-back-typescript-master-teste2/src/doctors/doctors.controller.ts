// src/doctors/doctors.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { JwtStrategy } from '../auth/jwt.strategy';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('register')
  async register(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @UseGuards(JwtStrategy)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.doctorsService.findByUserId(userId);
  }
}
