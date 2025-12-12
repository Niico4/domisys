import { Request, Response } from 'express';

import { UserRepository } from '@/domain/repositories/user.repository';

import { UpdateProfile } from '@/domain/use-cases/user/update-profile';
import { ChangePassword } from '@/domain/use-cases/user/change-password';
import { GetCurrentUser } from '@/domain/use-cases/user/get-current-user';
import { GetAllAdmins } from '@/domain/use-cases/user/get-all-admins';
import { GetAllDeliveries } from '@/domain/use-cases/user/get-all-deliveries';

import { updateProfileSchema } from '@/domain/dtos/user/update-profile.dto';
import { changePasswordSchema } from '@/domain/dtos/user/change-password.dto';

import { ResponseHandler } from '@/shared/http/response-handler';
import { messages } from '@/shared/messages';

export const userController = (userRepository: UserRepository) => ({
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const useCase = new GetCurrentUser(userRepository);
      const user = await useCase.execute(userId);

      return ResponseHandler.ok(res, messages.user.retrievedSuccess(), user);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.user.retrieveError()
      );
    }
  },

  getAllAdmins: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllAdmins(userRepository);
      const admins = await useCase.execute();

      return ResponseHandler.ok(res, messages.user.getAdminsSuccess(), admins);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.user.getAdminsError()
      );
    }
  },

  getAllDeliveries: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllDeliveries(userRepository);
      const deliveries = await useCase.execute();

      return ResponseHandler.ok(res, messages.user.getDeliveriesSuccess(), deliveries);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.user.getDeliveriesError()
      );
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const dto = updateProfileSchema.parse(req.body);

      const useCase = new UpdateProfile(userRepository);
      const user = await useCase.execute(userId, dto);

      return ResponseHandler.ok(res, messages.user.updateSuccess(), user);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.user.updateError()
      );
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const dto = changePasswordSchema.parse(req.body);

      const useCase = new ChangePassword(userRepository);
      await useCase.execute(userId, dto);

      return ResponseHandler.ok(res, messages.user.passwordChangedSuccess());
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.user.changePasswordError()
      );
    }
  },
});
