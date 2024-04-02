import { z } from "zod";

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthSendResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const AuthResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
  oldPassword: z.string().min(6),
});
