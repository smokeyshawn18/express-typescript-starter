import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { env } from "./env";
import { logger } from "../utils/logger";
import { db } from "../db/client";
import * as schema from "../db/schema";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET ?? env.AUTH_TOKEN,
  baseURL: env.BETTER_AUTH_URL ?? `http://localhost:${env.PORT}`,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: false,
  },

  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        logger.info(`OTP generated for ${email} (${type}): ${otp}`);
      },
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: false,
      overrideDefaultEmailVerification: true,
    }),
  ],
});
