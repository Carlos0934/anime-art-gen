import { Hono } from "hono";
import { StripeRechargeSchema } from "./schemas";
import { eventBus } from "@/core/eventBus";
import { RechargeCreditsEvent } from "./handlers/recharge-credits-handler";
import { stripe } from "./config/stripe";

const paymentRoutes = new Hono();

paymentRoutes.post("/stripe-recharge", async (ctx) => {
  const body = await ctx.req.text();
  const signature = ctx.req.header("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!signature) {
    return ctx.json({ message: "Invalid request" }, 400);
  }

  const { data, type } = stripe.webhooks.constructEvent(
    body,
    signature,
    secret
  );

  if (type !== "checkout.session.completed") {
    return ctx.json({ message: "Invalid request" }, 400);
  }
  const result = StripeRechargeSchema.safeParse(data.object);

  if (!result.success) {
    console.log(result.error.issues);
    return ctx.json({ message: "Invalid data" }, 400);
  }
  const { customer_details, amount_subtotal, currency } = result.data;

  const event = new RechargeCreditsEvent({
    userEmail: customer_details.email,
    amount: {
      value: amount_subtotal,
      type: currency,
    },
  });

  const credits = await eventBus.publish(event);

  return ctx.text(`Recharged ${credits} credits`);
});

export default paymentRoutes;
