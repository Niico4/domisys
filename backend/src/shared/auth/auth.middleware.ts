import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UserRole } from '@/generated/enums';
import { messages } from '@/shared/messages';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: messages.auth.noTokenProvided(),
        error: 'UNAUTHORIZED',
      });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = JwtService.verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: messages.auth.tokenExpired(),
          error: 'TOKEN_EXPIRED',
        });
        return;
      }

      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: messages.auth.invalidToken(),
          error: 'INVALID_TOKEN',
        });
        return;
      }
    }

    res.status(401).json({
      success: false,
      message: messages.auth.tokenValidationError(),
      error: 'AUTHENTICATION_ERROR',
    });
  }
};

export const hasRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: messages.auth.notAuthenticated(),
        error: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: messages.auth.forbidden(),
        error: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
};
