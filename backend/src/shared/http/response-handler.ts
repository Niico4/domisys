import { Prisma } from '@/generated/client';
import { Response } from 'express';
import { ZodError } from 'zod';

export class ResponseHandler {
  static ok(res: Response, message: string, data: any = null, status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static handleException(res: Response, error: any, fallbackMessage: string) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: fallbackMessage,
        error: 'VALIDATION_ERROR',
        details: error.issues,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let status = 400;
      let code = error.code;
      let msg = fallbackMessage;

      switch (error.code) {
        case 'P2002': // unique constraint
          status = 409;
          msg = 'Ya existe un registro con estos valores únicos.';
          break;
        case 'P2003': // foreign key
          msg = 'La relación referenciada no existe.';
          break;
        case 'P2025': // record not found
          status = 404;
          msg = 'El registro solicitado no existe.';
          break;
      }

      return res.status(status).json({
        success: false,
        message: msg,
        error: code,
      });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Los datos enviados no cumplen con el formato requerido.',
        error: 'PRISMA_VALIDATION_ERROR',
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: fallbackMessage,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: fallbackMessage,
      error,
    });
  }
}
