// src/admin-log/entities/admin-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AdminLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  adminEmail: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  target?: string;

  @CreateDateColumn()
  createdAt: Date;
}
