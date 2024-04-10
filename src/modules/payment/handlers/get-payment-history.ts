import { Event, Handler } from "@/core/handler";
import { PaymentEvents } from "../events";
import { Payment } from "@/core/entities/payment";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";

export class GetPaymentHistoryHandler extends Handler<
  GetPaymentHistoryEvent,
  { payments: Payment[] }
> {
  eventName: string = PaymentEvents.GetPaymentHistory;

  async handle(
    { data: { userId } }: GetPaymentHistoryEvent,
    ctx: Context
  ): Promise<{ payments: Payment[] }> {
    const user = await ctx.userRepository.findById(userId);

    if (!user) {
      throw new Exception("User not found", ExceptionType.NotFound);
    }

    const payments = await ctx.paymentRepository.getPaymentsByUserId(userId);
    return { payments };
  }
}

export class GetPaymentHistoryEvent extends Event {
  name = PaymentEvents.GetPaymentHistory;
  constructor(public readonly data: { userId: string }) {
    super();
  }
}
