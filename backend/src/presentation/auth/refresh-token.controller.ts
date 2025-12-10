import { Request, Response } from 'express';

import { AuthRepository } from '@/domain/repositories/auth.repository';

import { JwtService } from '@/shared/auth/jwt.service';
import { ResponseHandler } from '@/shared/http/response-handler';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const refreshTokenController = (authRepository: AuthRepository) => ({
  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies['refresh_token'];

      if (!refreshToken) {
        return ResponseHandler.handleException(
          res,
          new BadRequestException(messages.auth.noTokenProvided()),
          messages.auth.noTokenProvided()
        );
      }

      const decoded = JwtService.verifyRefreshToken(refreshToken);

      const user = await authRepository.findById(decoded.id);

      const tokens = JwtService.generateTokenPair(user);

      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutos
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      });

      return ResponseHandler.ok(res, messages.auth.tokenRefreshedSuccess(), {
        user,
      });
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.auth.refreshTokenError()
      );
    }
  },
});
