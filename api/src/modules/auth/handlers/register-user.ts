import { Event, Handler } from "@/core/handler";

import { AuthEvents } from "../events";
import { Context } from "@/core/context";
import { User } from "@/core/entities/user";
import { UserAlreadyExistException } from "../exceptions/user-already-exist-error";

export class RegisterUserHandler extends Handler<RegisterUserEvent, void> {
  eventName = AuthEvents.RegisterUser;

  async handle(
    event: RegisterUserEvent,
    { userRepository, passwordHasher, mailer, jwtService }: Context
  ): Promise<void> {
    const userAlreadyExist = await userRepository.userExists(event.data.email);
    if (userAlreadyExist) throw new UserAlreadyExistException(event.data.email);

    const user = new User({
      email: event.data.email,
      password: await passwordHasher.hashPassword(event.data.password),
      createdAt: new Date(),
      credits: 0,
      emailVerified: null,
      id: crypto.randomUUID(),
    });

    await userRepository.save(user);

    const token = jwtService.sign({ email: user.email });
    const base_url = process.env.CONFIRM_EMAIL_CALLBACK_URL
      ? process.env.CONFIRM_EMAIL_CALLBACK_URL
      : "http://localhost:3000/auth/verify-email";

    const url = `${base_url}?token=${token}`;
    await mailer.send({
      template: {
        name: "email-verification",
        data: {
          link: url,
        },
      },
      to: user.email,
    });
  }
}

export class RegisterUserEvent extends Event {
  constructor(public readonly data: { email: string; password: string }) {
    super();
  }

  name = AuthEvents.RegisterUser;
}
