import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './usuarios.service';
import { CreateUserDto } from './dto/create-usuario.dto';
import { User } from './entities/usuario.entity';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { JwtStrategy } from '../auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtStrategy)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.usersService.findById(userId);
  }
}
