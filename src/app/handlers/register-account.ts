import { User } from "../../domain/entities/user";
import { Context } from "../../domain/context";
import { Event, Handler } from "../../domain/handler";
import { Events } from "../../domain/events";
import { UserAlreadyExistException } from "../../domain/exceptions/user-already-exist-error";
import hash from "../../infra/utils/hash";

export class RegisterAccountHandler extends Handler<
  RegisterAccountEvent,
  User
> {
  static eventName = Events.RegisterAccount;

  async handle(
    event: RegisterAccountEvent,
    { userRepository }: Context
  ): Promise<User> {
    const userAlreadyExist = await userRepository.userExist(event.data.email);
    if (userAlreadyExist) throw new UserAlreadyExistException(event.data.email);

    const user = new User({
      email: event.data.email,
      password: hash(event.data.password),
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
