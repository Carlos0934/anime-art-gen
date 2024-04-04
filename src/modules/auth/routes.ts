import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { RegisterUserEvent } from "./handlers/register-user";

import { LoginUserEvent } from "./handlers/login-user";
import {
  AuthLoginSchema,
  AuthRegisterSchema,
  AuthResetPasswordSchema,
  AuthSendResetPasswordSchema,
} from "./schemas/auth-schemas";
import { eventBus } from "@/core/eventBus";
import { ConfirmUserMailEvent } from "./handlers/confirm-user-mail";
import { SendPasswordResetEvent } from "./handlers/send-password-reset";
import { ResetUserPasswordEvent } from "./handlers/reset-user-password";

const authRoutes = new Hono();

authRoutes.post("/login", zValidator("json", AuthLoginSchema), async (ctx) => {
  const data = ctx.req.valid("json");
  const event = new LoginUserEvent(data);
  const result = await eventBus.publish(event);
  return ctx.json(result);
});

authRoutes.post(
  "/register",
  zValidator("json", AuthRegisterSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const event = new RegisterUserEvent(data);
    const result = await eventBus.publish(event);
    return ctx.json(result);
  }
);

authRoutes.get("/verify-email", async (ctx) => {
  const token = ctx.req.query("token");

  if (!token) {
    return ctx.text("Invalid token");
  }

  const event = new ConfirmUserMailEvent({ token });
  await eventBus.publish(event);
  return ctx.redirect("http://localhost:3000");
});

authRoutes.post(
  "/send-reset-password",
  zValidator("json", AuthSendResetPasswordSchema),
  async (ctx) => {
    const { email } = ctx.req.valid("json");
    const event = new SendPasswordResetEvent({ email });
    await eventBus.publish(event);
    return ctx.json({ message: "Email sent" });
  }
);

authRoutes.get("/reset-password", async (ctx) => {
  const token = ctx.req.query("token");

  if (!token) {
    return ctx.text("Invalid token");
  }

  return ctx.redirect(`http://localhost:3000/reset-password?token=${token}`);
});

authRoutes.post(
  "/reset-password",
  zValidator("json", AuthResetPasswordSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const event = new ResetUserPasswordEvent(data);
    await eventBus.publish(event);
    return ctx.json({ message: "Password reset" });
  }
);
export default authRoutes;