import { SUPPORTED_CURRENCIES } from "@/core/entities/payment";
import {
  text,
  sqliteTable,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password", { length: 60 }),
    credits: integer("credits").notNull().default(0),
    emailVerified: integer("email_verified", {
      mode: "timestamp_ms",
    }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (user) => ({
    emailIdx: index("shortPathIndex").on(user.email),
  })
);

export const imageGenerations = sqliteTable("image_generations", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  url: text("url").notNull(),
  metadata: text("metadata", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: real("amount").notNull(),
  currency: text("currency", SUPPORTED_CURRENCIES).notNull(),
  credits: integer("credits").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const schema = {
  users,
  imageGenerations,
  payments,
};
