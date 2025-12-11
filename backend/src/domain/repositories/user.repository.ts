import { UpdateProfileDtoType } from '@/domain/dtos/user/update-profile.dto';
import { ChangePasswordDtoType } from '@/domain/dtos/user/change-password.dto';
import { UserEntity } from '@/domain/entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findAllAdmins(): Promise<UserEntity[]>;
  updateProfile(userId: number, dto: UpdateProfileDtoType): Promise<UserEntity>;
  changePassword(userId: number, dto: ChangePasswordDtoType): Promise<void>;
  deleteAccount(userId: number): Promise<void>;
}
