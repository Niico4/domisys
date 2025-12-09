import jwt from 'jsonwebtoken';
import { UserRole } from '@/generated/enums';

import { JWT_SECRET, JWT_REFRESH_SECRET } from '@/config/env.config';

interface TokenPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

interface RefreshTokenPayload {
  id: number;
}

export class JwtService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
  }

  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }

  static generateTokenPair(user: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
  }) {
    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.generateRefreshToken({
      id: user.id,
    });

    return { accessToken, refreshToken };
  }
}
