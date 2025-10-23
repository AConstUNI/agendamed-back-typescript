import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-usuario.dto';
import { AdminLogService } from 'src/admin-log/admin-log.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly adminLogService: AdminLogService
  ) {}

  async createAtendent(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const atendent = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: UserRole.ATENDENT,
    });

    return this.usersRepository.save(atendent);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.USER,
    });

    // Log the action
    await this.adminLogService.create(
      'admin@place.holder',
      'CREATE_DOCTOR',
      createUserDto.name,
    );

    return this.usersRepository.save(user);
  }

  async createWithRole(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getAll() {
    return this.usersRepository.find()
  }
}
