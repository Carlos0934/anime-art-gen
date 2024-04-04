import { Hono } from "hono";

const paymentRoutes = new Hono();

paymentRoutes.post("/stripe-recharge", async (ctx) => {
  const data = await ctx.req.json();

  if (data.type !== "checkout.session.completed") {
    return ctx.json({ message: "Invalid request" }, 400);
  }

  console.log("Recharging credits with Stripe");
  console.log(data);
  console.log(data.data.object.customer_details);
  console.log(data.data.object.amount_total);
  return ctx.text("Recharging credits with Stripe");
});

export default paymentRoutes;
