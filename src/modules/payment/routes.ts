import { Hono } from "hono";
import { StripeRechargeSchema } from "./schemas";
import { eventBus } from "@/core/eventBus";
import { RechargeCreditsEvent } from "./handlers/recharge-credits-handler";

const paymentRoutes = new Hono();

paymentRoutes.post("/stripe-recharge", async (ctx) => {
  const { type, data } = await ctx.req.json();

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

  await eventBus.publish(event);

  return ctx.text("Recharging credits with Stripe");
});

export default paymentRoutes;
