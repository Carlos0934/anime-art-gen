import { User } from "@/core/entities/user";
import { Event, Handler } from "@/core/handler";
import { AuthEvents } from "../events";
import { Context } from "@/core/context";

export class GetUserProfileHandler extends Handler<
  GetUserProfileEvent,
  { user: Omit<User, "password" | "emailVerified"> | null }
> {
  eventName: string = AuthEvents.GetUserProfile;

  async handle(
    { data: { userId } }: GetUserProfileEvent,
    ctx: Context
  ): Promise<{ user: Omit<User, "password" | "emailVerified"> | null }> {
    const user = await ctx.userRepository.getById(userId);
    if (!user) {
      return { user: null };
    }

    const result: Omit<User, "password" | "emailVerified"> = {
      id: user.id,
      email: user.email,
      credits: user.credits,
      createdAt: user.createdAt,
    };

    return { user: result };
  }
}

export class GetUserProfileEvent extends Event {
  name = AuthEvents.GetUserProfile;
  constructor(public readonly data: { userId: string }) {
    super();
  }
}
