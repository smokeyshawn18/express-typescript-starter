import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { userProfiles } from "./user.model";

export type UserProfile = InferSelectModel<typeof userProfiles>;
export type NewUserProfile = InferInsertModel<typeof userProfiles>;

export type OTPType = "sign-in" | "email-verification";

export interface SendOtpDto {
  email: string;
  type?: OTPType;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
  name?: string;
  image?: string;
}

export interface UpdateUserDto {
  phone?: string;
}

export interface AuthUserView {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
}

export interface CurrentUserResponse {
  user: AuthUserView;
  profile: UserProfile | null;
}
