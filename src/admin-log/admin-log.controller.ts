// src/admin-log/admin-log.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminLogService } from './admin-log.service';

@Controller('admin/logs')
export class AdminLogController {
  constructor(private readonly adminLogService: AdminLogService) {}

  @Get()
  findAll() {
    return this.adminLogService.findAll();
  }
}
