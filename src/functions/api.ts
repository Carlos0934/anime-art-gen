import { AuthModule } from "@/auth/module";
import { createHonoApp } from "@/core/http/server";
import { PaymentModule } from "@/payment/module";
import { handle } from "hono/aws-lambda";
import { GenerationModule } from "modules/generation/module";

const app = createHonoApp([AuthModule, PaymentModule, GenerationModule]);

export const handler = handle(app);
