import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../config";
import * as schema from "./schema";
import { logger } from "../utils/logger";

type SqlClient = ReturnType<typeof postgres>;

let sql: SqlClient | null = null;

if (env.DATABASE_URL) {
  sql = postgres(env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
} else {
  logger.warn(
    "DATABASE_URL is not set. The app will run without a live database connection.",
  );
}

export const db = sql ? drizzle(sql, { schema }) : null;

export const closeDatabase = async () => {
  if (sql) {
    await sql.end({ timeout: 5 });
  }
};
