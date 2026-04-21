import type { NextFunction, Request, Response } from "express";
import { env } from "../config";
import { AppError } from "./error.middleware";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!env.AUTH_TOKEN) {
    next();
    return;
  }

  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Missing authorization token", 401));
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (token !== env.AUTH_TOKEN) {
    next(new AppError("Invalid authorization token", 401));
    return;
  }

  next();
};
