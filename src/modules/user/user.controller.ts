import type { Request, Response } from "express";
import { findAllUsers } from "./user.service";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await findAllUsers();

  res.json({
    success: true,
    data: users,
  });
};
