import { eq, desc } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "../../config/auth";
import { db } from "../../db/client";
import { AppError } from "../../middlewares/error.middleware";
import { userProfiles } from "./user.model";
import type {
  CurrentUserResponse,
  SendOtpDto,
  UpdateUserDto,
  UserProfile,
  VerifyOtpDto,
} from "./user.types";

const getHeaders = (req: Request) => fromNodeHeaders(req.headers);

const requireSession = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: getHeaders(req),
  });

  if (!session) {
    throw new AppError("Unauthorized", 401);
  }

  return session;
};

export const sendOtpForLogin = async ({
  email,
  type = "sign-in",
}: SendOtpDto): Promise<void> => {
  await auth.api.sendVerificationOTP({
    body: { email, type },
  });
};

export const verifyOtpAndSignIn = async ({
  req,
  email,
  otp,
  name,
  image,
}: VerifyOtpDto & { req: Request }) => {
  return auth.api.signInEmailOTP({
    headers: getHeaders(req),
    returnHeaders: true,
    body: {
      email,
      otp,
      ...(name ? { name } : {}),
      ...(image ? { image } : {}),
    },
  });
};

export const getCurrentUser = async (
  req: Request,
): Promise<CurrentUserResponse> => {
  const session = await requireSession(req);

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      name: session.user.name,
      image: session.user.image,
    },
    profile: profile ?? null,
  };
};

export const upsertCurrentUserProfile = async (
  req: Request,
  data: UpdateUserDto,
): Promise<UserProfile> => {
  const session = await requireSession(req);

  const [profile] = await db
    .insert(userProfiles)
    .values({
      userId: session.user.id,
      phone: data.phone ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: {
        phone: data.phone ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return profile;
};

export const getAllUsers = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{
  profiles: UserProfile[];
  total: number;
  page: number;
  limit: number;
}> => {
  const offset = (page - 1) * limit;

  const profiles = await db
    .select()
    .from(userProfiles)
    .orderBy(desc(userProfiles.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: userProfiles.userId })
    .from(userProfiles);

  const total = countResult.length ?? 0;

  return {
    profiles,
    total,
    page,
    limit,
  };
};
