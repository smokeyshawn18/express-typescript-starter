import type { Request, Response } from "express";

import {
  getAllUsers,
  getCurrentUser,
  sendOtpForLogin,
  upsertCurrentUserProfile,
  verifyOtpAndSignIn,
} from "./user.service";

import {
  getUsersSchema,
  sendOtpSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from "./zodSchemaFn";

export const requestOtp = async (req: Request, res: Response) => {
  const payload = sendOtpSchema.parse(req.body);

  await sendOtpForLogin(payload);

  res.status(200).json({
    success: true,
    message: "OTP sent",
  });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const payload = verifyOtpSchema.parse(req.body);
  const result = await verifyOtpAndSignIn({ ...payload, req });

  result.headers.forEach((value, key) => {
    res.append(key, value);
  });

  res.status(200).json({
    success: true,
    data: result.response,
  });
};

export const getMe = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  res.status(200).json({
    success: true,
    data: currentUser,
  });
};

export const updateMe = async (req: Request, res: Response) => {
  const payload = updateProfileSchema.parse(req.body);
  const profile = await upsertCurrentUserProfile(req, {
    phone: payload.phone ?? undefined,
  });

  res.status(200).json({
    success: true,
    data: profile,
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const payload = getUsersSchema.parse(req.query);
  const { page, limit } = payload;

  const result = await getAllUsers({ page, limit });

  res.status(200).json({
    success: true,
    data: result.profiles,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: Math.ceil(result.total / result.limit),
    },
  });
};
