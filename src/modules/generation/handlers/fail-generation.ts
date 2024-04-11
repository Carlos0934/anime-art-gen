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

    await ctx.tasksUsersKvStore.delete(taskId);

    const connection = await ctx.usersConnectionsKvStore.get(task.userId);

    if (connection) {
      await ctx.wsManagement.postToConnection(connection.connectionId, {
        action: "fail-generation",
        data: {
          taskId,
          error,
        },
      });
    }

    return;
  }
}
