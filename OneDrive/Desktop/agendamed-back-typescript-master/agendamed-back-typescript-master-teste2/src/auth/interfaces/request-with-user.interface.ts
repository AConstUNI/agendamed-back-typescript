// src/auth/interfaces/request-with-user.interface.ts
import { UserRole } from '../../usuarios/entities/usuario.entity';

export interface RequestWithUser extends Express.Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}
