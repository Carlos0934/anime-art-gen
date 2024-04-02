import { Context } from "@/core/context";
import { Events } from "../events";
import { Event, Handler } from "@/core/handler";

export class SendPasswordResetHandler extends Handler<
  SendPasswordResetEvent,
  void
> {
  eventName = Events.SendPasswordReset;

  async handle(
    event: SendPasswordResetEvent,
    { userRepository, mailer, jwtService }: Context
  ): Promise<void> {
    const { email } = event.data;

    const user = await userRepository.findByEmail(email);

    if (!user) return;

    const token = jwtService.sign({ email });

    await mailer.send({
      to: email,
      subject: "Password reset",
      text: `Click here to reset your password: http://localhost:3000/reset-password?token=${token}`,
    });
  }
}

export class SendPasswordResetEvent extends Event {
  name: string = Events.SendPasswordReset;
  constructor(public readonly data: { email: string }) {
    super();
  }
}
