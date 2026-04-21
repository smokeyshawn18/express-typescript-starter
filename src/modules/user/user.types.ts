import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "./user.model";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
