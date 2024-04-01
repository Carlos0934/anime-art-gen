import "dotenv/config";
import { createHonoApp } from "./infra/http/server";
import { serve } from "@hono/node-server";

const app = createHonoApp();

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
