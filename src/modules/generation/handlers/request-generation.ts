import { Handler } from "@/core/handler";

import { GenerationEvents, RequestGenerationEvent } from "../events";
import { Context } from "@/core/context";

export class RequestGenerationHandler extends Handler<
  RequestGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.ImageGenerationRequest;

  async handle(event: RequestGenerationEvent, ctx: Context): Promise<void> {
    await ctx.pubNotificationService.publish(event);
  }
}
