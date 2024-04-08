import { Handler } from "@/core/handler";
import {
  GenerationEvents,
  RequestGenerationCompletedEvent,
  RequestGenerationCompleteEvent,
} from "../events";
import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";
import { ImageGeneration } from "@/core/entities/image-generation";

export class CompleteGenerationHandler extends Handler<
  RequestGenerationCompleteEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationComplete;

  async handle(
    event: RequestGenerationCompleteEvent,
    ctx: Context
  ): Promise<void> {
    const { taskId, imageUrl, input } = event.data;
    const result = await ctx.tasksUsersKvStore.get(taskId);

    if (!result) {
      throw new Exception("Task does not exist", ExceptionType.BadArgument);
    }

    const { userId } = result;

    const image = new ImageGeneration({
      createdAt: new Date(),
      id: crypto.randomUUID(),
      url: imageUrl,
      userId,
      metadata: {
        height: input.height,
        width: input.width,
        input: {
          prompt: input.prompt,
          negativePrompt: input.negativePrompt,
          strength: input.strength,
          steps: input.steps,
          seed: input.seed,
          model: input.model,
          quality: input.quality,
          style: input.style,
        },
      },
    });

    await ctx.imageGenerationRepository.save(image);

    await ctx.tasksUsersKvStore.delete(taskId);

    const requestGenerationCompleteEvent = new RequestGenerationCompletedEvent({
      userId,
      taskId,
      imageId: image.id,
    });

    await ctx.pubNotificationService.publish(requestGenerationCompleteEvent);
    return;
  }
}
