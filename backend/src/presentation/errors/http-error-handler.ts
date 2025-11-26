import { Response } from 'express';
import { ZodError } from 'zod';

export function handleError(
  res: Response,
  error: any,
  fallbackMessage: string
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: fallbackMessage,
      errors: error.issues,
    });
  }

  return res.status(500).json({
    message: fallbackMessage,
    error: error instanceof Error ? error.message : error,
  });
}
