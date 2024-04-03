import { Event, Handler } from "@/core/handler";
import { PaymentEvents } from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";

export class RechargeCreditsHandler extends Handler<
  RechargeCreditsEvent,
  void
> {
  eventName = PaymentEvents.RechargeCredits;

  async handle(event: RechargeCreditsEvent, ctx: Context): Promise<void> {
    const { userId, credits } = event.data;

    const user = await ctx.userRepository.findByEmail(userId);

    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    user.credits += credits;

    await ctx.userRepository.update(user);
  }
}

export class RechargeCreditsEvent extends Event {
  name = PaymentEvents.RechargeCredits;
  constructor(public readonly data: { userId: string; credits: number }) {
    super();
  }
}
