import { Event, Handler } from "@/core/handler";

import { Events } from "../events";
import { Exception, ExceptionType } from "@/core/exception";
import { Context } from "@/core/context";
import { User } from "@/core/entities/user";
import { UserAlreadyExistException } from "../exceptions/user-already-exist-error";

export class RegisterAccountHandler extends Handler<
  RegisterAccountEvent,
  User
> {
  eventName = Events.RegisterAccount;

  async handle(
    event: RegisterAccountEvent,
    { userRepository, passwordHasher }: Context
  ): Promise<User> {
    const userAlreadyExist = await userRepository.userExist(event.data.email);
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

    return user;
  }
}

export class RegisterAccountEvent extends Event {
  constructor(public readonly data: { email: string; password: string }) {
    super();
  }

  name = Events.RegisterAccount;
}
