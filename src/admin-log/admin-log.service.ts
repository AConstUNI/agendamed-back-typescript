// src/admin-log/admin-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminLog } from './entities/admin-log.entity';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLog)
    private logRepository: Repository<AdminLog>,
  ) {}

  async create(adminEmail: string, action: string, target?: string) {
    const log = this.logRepository.create({ adminEmail, action, target });
    return this.logRepository.save(log);
  }

  async findAll() {
    return this.logRepository.find({ order: { createdAt: 'DESC' } });
  }
}
