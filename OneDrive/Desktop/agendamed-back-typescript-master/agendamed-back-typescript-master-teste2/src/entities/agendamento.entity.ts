!	import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor',
  AGENDA = 'agenda'
}

@Entity()
export class Agenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paciente: string;

  @Column()
  telefone: string;

  @Column()
  medico: string;

  @Column()
  especialidade: string;
  
  @Column()
  data: Date;

  @Column()
  horario: string;

  @Column()
  observacoes: string;
  
  @Column()
  status: string;
}