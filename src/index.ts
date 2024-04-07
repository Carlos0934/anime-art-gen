import "dotenv/config";

import { serve } from "@hono/node-server";
import { createHonoApp } from "@/core/http/server";
import { AuthModule } from "@/auth/module";
import { PaymentModule } from "@/payment/module";
import { GenerationModule } from "modules/generation/module";

const app = createHonoApp([AuthModule, PaymentModule, GenerationModule]);

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
