import { z } from "zod";

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
