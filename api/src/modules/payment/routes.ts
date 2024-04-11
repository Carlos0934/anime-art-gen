import { Hono } from "hono";
import { StripeRechargeSchema } from "./schemas";
import { eventBus } from "@/core/eventBus";
import { RechargeCreditsEvent } from "./handlers/recharge-credits-handler";
import { parseStripeEvent } from "./config/stripe";
import { GetPaymentHistoryEvent } from "./handlers/get-payment-history";
import { jwt } from "hono/jwt";

const paymentRoutes = new Hono();

paymentRoutes.post("/stripe-recharge", async (ctx) => {
  const { type, data } = await parseStripeEvent(ctx.req);

  if (type !== "checkout.session.completed") {
    return ctx.json({ message: "Invalid request" }, 400);
  }
  const result = StripeRechargeSchema.safeParse(data.object);

  if (!result.success) {
    return ctx.json({ message: "Invalid data" }, 400);
  }
  const { customer_details, amount_subtotal, currency } = result.data;

  const event = new RechargeCreditsEvent({
    userEmail: customer_details.email,
    amount: {
      value: amount_subtotal / 100, // Stripe returns the amount in cents
      currency: currency,
    },
  });

  const credits = await eventBus.publish(event);

  return ctx.text(`Recharged ${credits} credits`);
});

paymentRoutes.get(
  "/history",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
  async (ctx) => {
    const userId = ctx.get("jwtPayload").userId;

    const event = new GetPaymentHistoryEvent({ userId });

    const result = await eventBus.publish(event);

    return ctx.json(result);
  }
);
export default paymentRoutes;
