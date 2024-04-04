import { Exception, ExceptionType } from "@/core/exception";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const parseStripeEvent = async (req: Request): Promise<Stripe.Event> => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!signature) {
    throw new Exception("Invalid request", ExceptionType.BadArgument);
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error(error);
    throw new Exception("Invalid request", ExceptionType.Forbidden);
  }
};
