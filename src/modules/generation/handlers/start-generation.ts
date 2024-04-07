import { Event, Handler } from "@/core/handler";
import { GenerationEvents } from "../events";
import { Context } from "@/core/context";
import { GenerateImageInput } from "@/core/utils/image-generator-client/interface";

export class StartGenerationHandler extends Handler<
  StartGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationStart;

  async handle(event: StartGenerationEvent, ctx: Context): Promise<void> {
    const { userId, params } = event.data;

    const { taskId } = await ctx.imageGeneratorClient.generateImage(params);
  }
}
export class StartGenerationEvent extends Event {
  name = GenerationEvents.ImageGenerationStart;
  constructor(
    public readonly data: { userId: string; params: GenerateImageInput }
  ) {
    super();
  }
}
