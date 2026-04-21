import type { Request, Response } from "express";
import { env } from "../../config";

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
};
