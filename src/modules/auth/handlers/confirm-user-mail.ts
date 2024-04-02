import { Event, Handler } from "@/core/handler";

import { AuthEvents } from "../events";
import { Exception, ExceptionType } from "@/core/exception";
import { Context } from "@/core/context";

export class ConfirmUserMailHandler extends Handler<
  ConfirmUserMailEvent,
  void
> {
  eventName = AuthEvents.ConfirmUserMail;

  async handle(event: ConfirmUserMailEvent, ctx: Context): Promise<void> {
    const { token } = event.data;
    const payload = ctx.jwtService.verify<{ email: string }>(token);

    if (!payload)
      throw new Exception("Invalid token", ExceptionType.BadArgument);

    const { email } = payload;

    const user = await ctx.userRepository.findByEmail(email);

    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    if (user.emailVerified) return;

    user.emailVerified = new Date();

    await ctx.userRepository.update(user);
  }
}

export class ConfirmUserMailEvent extends Event {
  name = AuthEvents.ConfirmUserMail;
  constructor(public readonly data: { token: string }) {
    super();
  }
}
