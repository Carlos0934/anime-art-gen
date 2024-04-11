import { Context } from "@/core/context";
import { AuthEvents } from "../events";
import { Event, Handler } from "@/core/handler";

export class SendPasswordResetHandler extends Handler<
  SendPasswordResetEvent,
  void
> {
  eventName = AuthEvents.SendPasswordReset;

  async handle(
    event: SendPasswordResetEvent,
    { userRepository, mailer, jwtService }: Context
  ): Promise<void> {
    const { email } = event.data;

    const user = await userRepository.getByEmail(email);

    if (!user) return;

    const token = jwtService.sign({ email });

    await mailer.send({
      to: email,
      template: {
        name: "password-reset",
        data: {
          link: `http://localhost:3000/auth/reset-password?token=${token}`,
        },
      },
    });
  }
}

export class SendPasswordResetEvent extends Event {
  name: string = AuthEvents.SendPasswordReset;
  constructor(public readonly data: { email: string }) {
    super();
  }
}
