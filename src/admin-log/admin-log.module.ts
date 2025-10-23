// src/admin-log/admin-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLog } from './entities/admin-log.entity';
import { AdminLogService } from './admin-log.service';
import { AdminLogController } from './admin-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminLog])],
  providers: [AdminLogService],
  controllers: [AdminLogController],
  exports: [AdminLogService], // allow other modules to inject it
})
export class AdminLogModule {}
