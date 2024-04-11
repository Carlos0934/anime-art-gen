import { AuthEvents } from "../events";
import { Exception, ExceptionType } from "@/core/exception";
import { Context } from "@/core/context";
import { Event, Handler } from "@/core/handler";

export class ResetUserPasswordHandler extends Handler<
  ResetUserPasswordEvent,
  void
> {
  eventName = AuthEvents.ResetUserPassword;

  async handle(event: ResetUserPasswordEvent, ctx: Context): Promise<void> {
    const { token, newPassword, oldPassword } = event.data;

    const payload = ctx.jwtService.verify<{ email: string }>(token);

    if (!payload)
      throw new Exception("Invalid token", ExceptionType.BadArgument);

    const { email } = payload;

    const user = await ctx.userRepository.getByEmail(email);

    if (!user || !user.password)
      throw new Exception("User not found", ExceptionType.NotFound);

    const passwordMatch = await ctx.passwordHasher.comparePassword(
      oldPassword,
      user.password
    );

    if (!passwordMatch)
      throw new Exception("Invalid password", ExceptionType.Unauthorized);

    user.password = await ctx.passwordHasher.hashPassword(newPassword);

    await ctx.userRepository.update(user);
  }
}

export class ResetUserPasswordEvent extends Event {
  name = AuthEvents.ResetUserPassword;
  constructor(
    public readonly data: {
      token: string;
      newPassword: string;
      oldPassword: string;
    }
  ) {
    super();
  }
}
