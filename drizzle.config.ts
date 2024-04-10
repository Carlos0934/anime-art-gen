import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/core/config/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
  out: "./migrations",
});
