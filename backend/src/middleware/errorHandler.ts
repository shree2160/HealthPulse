// =============================================
// Global Error Handler Middleware
// =============================================

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/api.types';

export class AppError extends Error {
  public statusCode: number;
  public details?: string;

  constructor(statusCode: number, message: string, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${new Date().toISOString()}:`, err.message);

  if (err instanceof AppError) {
    const errorResponse: ApiError = {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Unexpected errors
  const errorResponse: ApiError = {
    statusCode: 500,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  };
  res.status(500).json(errorResponse);
};
