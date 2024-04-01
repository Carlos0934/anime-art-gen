import { Context } from "../../domain/context";
import { Events } from "../../domain/events";
import { Exception, ExceptionType } from "../../domain/exceptions/exception";
import { Event, Handler } from "../../domain/handler";
import { compareHash } from "../../infra/utils/compare-hash";
import jwt from "jsonwebtoken";

export class LoginUserHandler
  implements Handler<LoginUserEvent, { token: string }>
{
  static eventName = Events.LoginUser;

  async handle(
    event: LoginUserEvent,
    context: Context
  ): Promise<{ token: string }> {
    const { email, password } = event.data;

    const user = await context.userRepository.findByEmail(email);

    if (!user) {
      throw new Exception("User not found", ExceptionType.NotFound);
    }

    if (!user.emailVerified) {
      throw new Exception("Email not verified", ExceptionType.Forbidden);
    }

    if (!user.password) {
      throw new Exception("User has no password", ExceptionType.Forbidden);
    }

    const passwordMatch = compareHash(password, user.password);
    if (!passwordMatch) {
      throw new Exception("Invalid password", ExceptionType.Unauthorized);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    return { token };
  }
}

export class LoginUserEvent extends Event {
  name = Events.LoginUser;
  constructor(public readonly data: { email: string; password: string }) {
    super();
  }
}
