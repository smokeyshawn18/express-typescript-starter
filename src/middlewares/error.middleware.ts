import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { env } from "../config";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof Error ? error.message : "Internal server error";

  if (statusCode >= 500) {
    logger.error(message, error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== "production" && error instanceof Error
      ? { stack: error.stack }
      : {}),
  });
};
