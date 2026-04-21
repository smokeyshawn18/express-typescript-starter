import { desc } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "./user.model";
import type { User } from "./user.types";

const demoUsers: User[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Demo User",
    email: "demo@example.com",
    password: "demo-password",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const findAllUsers = async (): Promise<User[]> => {
  if (!db) {
    return demoUsers;
  }

  return db.select().from(users).orderBy(desc(users.createdAt));
};
