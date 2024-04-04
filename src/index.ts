import "dotenv/config";

import { serve } from "@hono/node-server";
import { createHonoApp } from "@/core/http/server";
import { AuthModule } from "@/auth/module";
import { PaymentModule } from "@/payment/module";

const app = createHonoApp([AuthModule, PaymentModule]);

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
