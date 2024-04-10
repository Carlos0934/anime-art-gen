import { Context } from "@/core/context";
import {
  FailRequestGenerationEvent,
  GenerationEvents,
  RequestGenerationFailedEvent,
} from "../events";
import { Handler } from "@/core/handler";

export class FailGenerationHandler extends Handler<
  FailRequestGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationFail;

  async handle(
    { data: { taskId, error } }: FailRequestGenerationEvent,
    ctx: Context
  ): Promise<void> {
    const task = await ctx.tasksUsersKvStore.get(taskId);
    if (!task) return;

    const user = await ctx.userRepository.findById(task.userId);
    if (!user) return;

    user.credits += 1;

    await ctx.userRepository.update(user);

    const failGenerationEvent = new RequestGenerationFailedEvent({
      taskId,
      error,
    });

    await ctx.pubNotificationService.publish(failGenerationEvent);

    return;
  }
}
