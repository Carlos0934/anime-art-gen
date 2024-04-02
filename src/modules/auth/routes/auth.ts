import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { RegisterAccountEvent } from "../../../modules/auth/handlers/register-account";

import { LoginUserEvent } from "../../../modules/auth/handlers/login-user";
import { AuthLoginSchema, AuthRegisterSchema } from "../schemas/auth-schemas";
import { eventBus } from "@/core/eventBus";

const authRouter = new Hono();

authRouter.post("/login", zValidator("json", AuthLoginSchema), async (ctx) => {
  const data = ctx.req.valid("json");
  const event = new LoginUserEvent(data);
  const result = await eventBus.publish(event);
  return ctx.json(result);
});

authRouter.post(
  "/register",
  zValidator("json", AuthRegisterSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const event = new RegisterAccountEvent(data);
    const result = await eventBus.publish(event);
    return ctx.json(result);
  }
);

export default authRouter;
