import { Handler } from "@/core/handler";
import {
  GenerationEvents,
  RequestGenerationEvent,
  RequestGenerationStartedEvent,
} from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";

export class StartGenerationRequestHandler extends Handler<
  RequestGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationRequest;

  async handle(
    { data: { params, userId } }: RequestGenerationEvent,
    ctx: Context
  ): Promise<void> {
    const user = await ctx.userRepository.findById(userId);
    if (!user) throw new Exception("User not found", ExceptionType.NotFound);

    const { taskId } = await ctx.imageGeneratorClient.generateImage(params);

    user.credits -= 1;

    await ctx.userRepository.update(user);

    ctx.tasksUsersKvStore.set(taskId, { taskId, userId });

    const startGenerationEvent = new RequestGenerationStartedEvent({
      userId,
      taskId,
    });

    await ctx.pubNotificationService.publish(startGenerationEvent);

    return;
  }
}
