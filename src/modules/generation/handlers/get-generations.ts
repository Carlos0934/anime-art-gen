import { Event, Handler } from "@/core/handler";
import { GenerationEvents } from "../events";
import { ImageGeneration } from "@/core/entities/image-generation";
import { Context } from "@/core/context";

export class GetImageGenerationsHandler extends Handler<
  GetImageGenerationsEvent,
  ImageGeneration[]
> {
  eventName: string = GenerationEvents.GetGenerations;
  constructor() {
    super();
  }

  async handle(
    event: GetImageGenerationsEvent,
    ctx: Context
  ): Promise<ImageGeneration[]> {
    const { userId } = event.data;

    const user = await ctx.userRepository.getById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.imageGenerationRepository.getByUserId(userId);
  }
}

export class GetImageGenerationsEvent extends Event {
  readonly name = GenerationEvents.GetGenerations;
  constructor(public readonly data: { userId: string }) {
    super();
  }
}
