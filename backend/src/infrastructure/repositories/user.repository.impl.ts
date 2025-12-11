import { UserRepository } from '@/domain/repositories/user.repository';

export const userRepositoryImplementation = (
  datasource: UserRepository
): UserRepository => {
  return {
    findById: (id: number) => datasource.findById(id),
    findAllAdmins: () => datasource.findAllAdmins(),
    updateProfile: (userId: number, dto) => datasource.updateProfile(userId, dto),
    changePassword: (userId: number, dto) => datasource.changePassword(userId, dto),
    deleteAccount: (userId: number) => datasource.deleteAccount(userId),
  };
};
