import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../config";
import * as schema from "./schema";
import { logger } from "../utils/logger";

const sql = env.DATABASE_URL
  ? postgres(env.DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

if (!sql) {
  logger.warn("DATABASE_URL is not set. DB will not be initialized.");
}

/**
 * ⚠️ IMPORTANT:
 * If sql is null, app should not proceed in production.
 */
export const db = sql ? drizzle(sql, { schema }) : (null as never); // forces crash if misused

export const closeDatabase = async () => {
  if (sql) {
    await sql.end({ timeout: 5 });
  }
};
