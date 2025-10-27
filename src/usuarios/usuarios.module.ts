import { Module } from '@nestjs/common';
import { UsersService } from './usuarios.service';
import { UsersController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { AdminLogModule } from 'src/admin-log/admin-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminLogModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsuariosModule {}
