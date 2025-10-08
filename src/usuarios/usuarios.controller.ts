import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './usuarios.service';
import { CreateUserDto } from './dto/create-usuario.dto';
import { User } from './entities/usuario.entity';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('attendants')
  async registerAtendent(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAtendent(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.usersService.findById(userId);
  }

  @Get('all')
  async getUsers() {
    return this.usersService.getAll();
  }
}
