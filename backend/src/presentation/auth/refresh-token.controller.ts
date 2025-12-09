import { Request, Response } from 'express';

import { AuthRepository } from '@/domain/repositories/auth.repository';

import { JwtService } from '@/shared/auth/jwt.service';
import { ResponseHandler } from '@/shared/http/response-handler';
import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export const refreshTokenController = (authRepository: AuthRepository) => ({
  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

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

      return ResponseHandler.ok(
        res,
        messages.auth.tokenRefreshedSuccess(),
        tokens
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.auth.refreshTokenError()
      );
    }
  },
});
