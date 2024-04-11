import { Exception, ExceptionType } from "@/core/exception";
import { HonoRequest } from "hono";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const parseStripeEvent = async (
  req: HonoRequest
): Promise<Stripe.Event> => {
  const body = await req.text();

  const signature = req.raw.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!signature) {
    throw new Exception("Invalid request", ExceptionType.BadArgument);
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    throw new Exception("Invalid request", ExceptionType.Forbidden);
  }
};
