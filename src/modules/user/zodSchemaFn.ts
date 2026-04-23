import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email(),
  type: z.enum(["sign-in", "email-verification"]).optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(10),
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
});

export const updateProfileSchema = z.object({
  phone: z.string().min(6).max(30).nullable().optional(),
});

export const getUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
