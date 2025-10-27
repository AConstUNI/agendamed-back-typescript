// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuário
  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.UsersService.create({
      ...registerDto,
      password: hashedPassword, // senha já criptografada
    });
    return user;
  }

  // Valida usuário no login
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.UsersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Senha inválida');

    return user;
  }

  // Retorna JWT
  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
