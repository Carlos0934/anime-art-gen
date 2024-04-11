import { z } from "zod";

export const StripeRechargeSchema = z.object({
  customer_details: z.object({
    email: z.string(),
  }),

  amount_subtotal: z.number(),

  currency: z.string().toUpperCase(),

  status: z.literal("complete"),
  payment_status: z.literal("paid"),
});
