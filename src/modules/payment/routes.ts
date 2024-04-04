import { Hono } from "hono";

const paymentRoutes = new Hono();

paymentRoutes.get("/stripe-recharge", (ctx) => {
  console.log("Recharging credits with Stripe");
  const data = ctx.req.queries();
  console.log(data);
  return ctx.text("Recharging credits with Stripe");
});

export default paymentRoutes;
