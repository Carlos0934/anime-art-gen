import { eq } from "drizzle-orm";

import { User } from "../../entities/user";
import { UserRepository } from "../user-repository";

import { users } from "@/core/config/db/schema";
import database from "@/core/config/db/database";

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: typeof database) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user ? new User(user) : null;
  }
  async userExist(email: string): Promise<boolean> {
    const result = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user ? new User(user) : null;
  }

  async save(user: User): Promise<void> {
    await this.db.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.password,
      credits: user.credits,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    });
  }

  async update(user: User): Promise<void> {
    await this.db.update(users).set({
      email: user.email,
      password: user.password,
      credits: user.credits,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    });
  }

  async delete(user: User): Promise<void> {
    await this.db.delete(users).where(eq(users.id, user.id));
  }
}
