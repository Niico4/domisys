import { UserEntity } from '@/domain/entities/user.entity';

export interface AuthResponse {
  user: UserEntity;
  token: string;
  refreshToken?: string;
}
