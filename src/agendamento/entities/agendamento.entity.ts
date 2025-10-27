import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';
import { DoctorRegister } from '../../doctors/entities/doctor-register.entity';

@Entity()
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pacienteId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pacienteId' })
  paciente: User;

  @Column()
  medicoId: number;

  @ManyToOne(() => DoctorRegister, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicoId' })
  medico: DoctorRegister;

  @Column()
  data: string; // YYYY-MM-DD

  @Column()
  hora: string; // HH:mm

  @Column()
  sala: string;

  @Column()
  telefone: string;

  @Column({default: false})
  active: Boolean;
}
