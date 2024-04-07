import { Event, Handler } from "@/core/handler";
import { GenerationEvents } from "../events";
import { Context } from "@/core/context";

export class StartGenerationHandler extends Handler<
  StartGenerationEvent,
  void
> {
  eventName: string = GenerationEvents.StartGeneration;

  handle(event: StartGenerationEvent, ctx: Context): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
export class StartGenerationEvent extends Event {
  name = GenerationEvents.StartGeneration;
  constructor(public readonly data: { generationId: string }) {
    super();
  }
}
