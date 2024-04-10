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
import { jwt } from "hono/jwt";
import { GetUserProfileEvent } from "./handlers/get-user-profile";

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
    await eventBus.publish(event);
    return ctx.json({ message: "User registered" }, 201);
  }
);

authRoutes.get("/verify-email", async (ctx) => {
  const token = ctx.req.query("token");

  if (!token) {
    return ctx.text("Invalid token");
  }

  const event = new ConfirmUserMailEvent({ token });
  await eventBus.publish(event);
  return ctx.redirect("https://anime-art-gen.com/login");
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

  return ctx.redirect(
    `https://api.anime-art-gen.com/reset-password?token=${token}`
  );
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

authRoutes.get(
  "/profile",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
  async (ctx) => {
    const { userId } = ctx.get("jwtPayload") as { userId: string };
    const event = new GetUserProfileEvent({ userId });

    const result = await eventBus.publish(event);
    return ctx.json(result);
  }
);
export default authRoutes;
