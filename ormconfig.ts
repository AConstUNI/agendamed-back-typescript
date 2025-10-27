import { DataSource } from 'typeorm';
import { User } from './src/usuarios/entities/usuario.entity';
import { DoctorRegister } from './src/doctors/entities/doctor-register.entity';
import * as dotenv from 'dotenv';
import { AdminLog } from './src/admin-log/entities/admin-log.entity';
import { Agendamento } from './src/agendamento/entities/agendamento.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'nestdb',
  entities: [User, DoctorRegister, Agendamento, AdminLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
