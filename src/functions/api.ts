import { AuthModule } from "@/auth/module";
import { createHonoApp } from "@/core/http/server";
import { handle } from "hono/aws-lambda";

const app = createHonoApp([AuthModule]);

export const handler = handle(app);
