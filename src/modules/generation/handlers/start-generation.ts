import { Handler } from "@/core/handler";
import {
  GenerationEvents,
  StartRequestGenerationEvent,
  RequestGenerationStartedEvent,
} from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";

export class StartGenerationRequestHandler extends Handler<
  StartRequestGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationStart;

  async handle(
    { data: { params, userId } }: StartRequestGenerationEvent,
    ctx: Context
  ): Promise<void> {
    const user = await ctx.userRepository.getById(userId);
    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    const { taskId } = await ctx.imageGeneratorClient.generateImage(
      params,
      userId
    );

    user.credits -= 1;

    await ctx.userRepository.update(user);

    await ctx.tasksUsersKvStore.set(taskId, { taskId, userId });

    const result = await ctx.usersConnectionsKvStore.get(userId);
    if (result) {
      ctx.wsManagement.postToConnection(result.connectionId, {
        action: "start-generation",
        data: {
          taskId,
        },
      });
    }

    return;
  }
}
