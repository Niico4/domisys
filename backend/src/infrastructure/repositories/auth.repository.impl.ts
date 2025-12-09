import { AuthDatasource } from '@/domain/datasources/auth.datasource';
import { LoginDtoType } from '@/domain/dtos/auth/login.dto';
import { RegisterDtoType } from '@/domain/dtos/auth/register.dto';
import { AuthRepository } from '@/domain/repositories/auth.repository';
import { UserRole } from '@/generated/enums';

export const authRepositoryImplementation = (
  datasource: AuthDatasource
): AuthRepository => ({
  register: (dto: RegisterDtoType, role: UserRole) =>
    datasource.register(dto, role),
  login: (dto: LoginDtoType) => datasource.login(dto),

  findByEmail: (email: string) => datasource.findByEmail(email),
  findByUsername: (username: string) => datasource.findByUsername(username),
  findByEmailOrUsername: (emailOrUsername: string) =>
    datasource.findByEmailOrUsername(emailOrUsername),
  findById: (id: number) => datasource.findById(id),
  isFirstUser: () => datasource.isFirstUser(),
});
