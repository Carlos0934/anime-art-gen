import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  AuthLoginSchema,
  AuthRegisterSchema,
} from "../../schemas/auth-schemas";
import { RegisterAccountEvent } from "../../../app/handlers/register-account";

import { eventBus } from "../../utils/event-bus";
import { LoginUserEvent } from "../../../app/handlers/login-user";

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
