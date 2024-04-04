import { Event, Handler } from "@/core/handler";

import { AuthEvents } from "../events";
import { Context } from "@/core/context";
import { User } from "@/core/entities/user";
import { UserAlreadyExistException } from "../exceptions/user-already-exist-error";

export class RegisterUserHandler extends Handler<RegisterUserEvent, User> {
  eventName = AuthEvents.RegisterUser;

  async handle(
    event: RegisterUserEvent,
    { userRepository, passwordHasher, mailer, jwtService }: Context
  ): Promise<User> {
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
    await mailer.send({
      template: {
        name: "email-verification",
        data: {
          link: `http://localhost:3000/auth/verify-email?token=${token}`,
        },
      },
      to: user.email,
    });
    return user;
  }
}

export class RegisterUserEvent extends Event {
  constructor(public readonly data: { email: string; password: string }) {
    super();
  }

  name = AuthEvents.RegisterUser;
}
