import { Event, Handler } from "@/core/handler";

import { Events } from "../events";

import { Context } from "@/core/context";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exeception";
import { EmailNotVerifiedException } from "../exceptions/email-not-verified-exeption";

export class LoginUserHandler extends Handler<
  LoginUserEvent,
  { token: string }
> {
  readonly eventName = Events.LoginUser;

  async handle(
    event: LoginUserEvent,
    context: Context
  ): Promise<{ token: string }> {
    const { email, password } = event.data;

    const user = await context.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    if (!user.password) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = context.passwordHasher.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const token = context.jwtService.sign({ userId: user.id });
    return { token };
  }
}

export class LoginUserEvent extends Event {
  name = Events.LoginUser;
  constructor(public readonly data: { email: string; password: string }) {
    super();
  }
}
