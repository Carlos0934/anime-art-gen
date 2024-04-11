import { Handler } from "@/core/handler";
import {
  GenerationEvents,
  RequestGenerationCompletedEvent,
  CompleteRequestGenerationEvent,
} from "../events";
import { Context } from "@/core/context";
import { ImageGeneration } from "@/core/entities/image-generation";

export class CompleteGenerationHandler extends Handler<
  CompleteRequestGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationComplete;

  async handle(
    event: CompleteRequestGenerationEvent,
    ctx: Context
  ): Promise<void> {
    const { taskId, imageUrl, input, userId } = event.data;

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

    const result = await ctx.usersConnectionsKvStore.get(userId);
    if (result) {
      ctx.wsManagement.postToConnection(result.connectionId, {
        action: "complete-generation",
        data: {
          image,
        },
      });
    }
    return;
  }
}
