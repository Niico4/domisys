import { Request, Response } from 'express';

import { AuthRepository } from '@/domain/repositories/auth.repository';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

import { registerDto } from '@/domain/dtos/auth/register.dto';
import { loginDto } from '@/domain/dtos/auth/login.dto';

import { Register } from '@/domain/use-cases/auth/register';
import { Login } from '@/domain/use-cases/auth/login';

import { ResponseHandler } from '@/shared/http/response-handler';
import { messages } from '@/shared/messages';

export const authController = (
  authRepository: AuthRepository,
  accessCodeRepository: AccessCodeRepository
) => ({
  register: async (req: Request, res: Response) => {
    try {
      const dto = registerDto.parse(req.body);

      const useCase = new Register(authRepository, accessCodeRepository);
      const data = await useCase.execute(dto);

      res.cookie('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutos
      });

      res.cookie('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      res.cookie('user_role', data.user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      const resData = {
        user: data.user,
      };

      return ResponseHandler.ok(
        res,
        messages.auth.registerSuccess(data.user.name),
        resData,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.general.error()
      );
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const dto = loginDto.parse(req.body);

      const useCase = new Login(authRepository);
      const data = await useCase.execute(dto);

      res.cookie('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutos
      });

      res.cookie('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      res.cookie('user_role', data.user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      const resData = {
        user: data.user,
      };

      return ResponseHandler.ok(
        res,
        messages.auth.loginSuccess(data.user.name),
        resData
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.general.error()
      );
    }
  },

  logout: async (_req: Request, res: Response) => {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });

      res.clearCookie('user_role', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });

      return ResponseHandler.ok(res, messages.auth.logoutSuccess());
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.general.error()
      );
    }
  },
});
