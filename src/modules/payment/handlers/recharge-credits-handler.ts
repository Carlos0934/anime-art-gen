import { Event, Handler } from "@/core/handler";
import { PaymentEvents } from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";
import { Amount } from "@/core/utils/credits-converter/converter";
import { Payment } from "@/core/entities/payment";

export class RechargeCreditsHandler extends Handler<
  RechargeCreditsEvent,
  number
> {
  eventName = PaymentEvents.RechargeCredits;

  async handle(event: RechargeCreditsEvent, ctx: Context): Promise<number> {
    const { userEmail, amount } = event.data;

    const user = await ctx.userRepository.findByEmail(userEmail);

    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    const credits = ctx.creditsConverter.convertToCredits(amount);

    user.credits += credits;
    const payment = new Payment({
      id: crypto.randomUUID(),
      userId: user?.id,
      amount: amount.value,
      currency: "USD",
      credits: credits,
      createdAt: new Date(),
    });

    await ctx.paymentRepository.save(payment);
    await ctx.userRepository.update(user);

    return credits;
  }
}

export class RechargeCreditsEvent extends Event {
  name = PaymentEvents.RechargeCredits;
  constructor(public readonly data: { userEmail: string; amount: Amount }) {
    super();
  }
}
