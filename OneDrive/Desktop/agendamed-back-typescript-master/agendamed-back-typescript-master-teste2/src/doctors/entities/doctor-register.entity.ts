// src/doctors/entities/doctor-register.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';

@Entity()
export class DoctorRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  crm: string;

  @Column()
  specialty: string;

  @Column()
  phone: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
