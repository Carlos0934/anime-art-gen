import { Event, Handler } from "@/core/handler";
import { PaymentEvents } from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";
import { Amount } from "@/core/utils/credits-converter/interface";

export class RechargeCreditsHandler extends Handler<
  RechargeCreditsEvent,
  void
> {
  eventName = PaymentEvents.RechargeCredits;

  async handle(event: RechargeCreditsEvent, ctx: Context): Promise<void> {
    const { userEmail, amount } = event.data;

    const user = await ctx.userRepository.findByEmail(userEmail);

    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    const credits = ctx.creditsConverter.convertToCredits(amount);

    user.credits += credits;

    await ctx.userRepository.update(user);
  }
}

export class RechargeCreditsEvent extends Event {
  name = PaymentEvents.RechargeCredits;
  constructor(public readonly data: { userEmail: string; amount: Amount }) {
    super();
  }
}
