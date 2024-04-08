import { ImageModels, ImageQualities } from "@/core/entities/image-generation";
import { Event } from "@/core/handler";
import { GenerateImageInput } from "@/core/utils/image-generator-client/interface";

export enum GenerationEvents {
  ImageGenerationRequest = "generation.image-generation-request",
  ImageGenerationStart = "generation.image-generation-start",
  ImageGenerationComplete = "generation.image-generation-complete",
}

export class RequestGenerationEvent extends Event {
  name = GenerationEvents.ImageGenerationRequest;
  constructor(
    public readonly data: { userId: string; params: GenerateImageInput }
  ) {
    super();
  }

  static fromJSON(data: any): RequestGenerationEvent {
    return new RequestGenerationEvent({
      userId: data.userId,
      params: {
        height: data.params.height,
        width: data.params.width,
        prompt: data.params.prompt,
        negativePrompt: data.params.negativePrompt,
        strength: data.params.strength,
        steps: data.params.steps,
        seed: data.params.seed,
        model: data.params.model,
        quality: data.params.quality,
        style: data.params.style,
      },
    });
  }
}

export class RequestGenerationStartEvent extends Event {
  name = GenerationEvents.ImageGenerationStart;
  constructor(public readonly data: { userId: string; taskId: string }) {
    super();
  }
}

export class RequestGenerationCompleteEvent extends Event {
  name = GenerationEvents.ImageGenerationComplete;
  constructor(
    public readonly data: {
      taskId: string;
      imageUrl: string;
      input: {
        height: number;
        width: number;
        prompt: string;
        negativePrompt?: string;
        strength: number;
        steps: number;
        seed: number;
        model: ImageModels;
        quality: ImageQualities;
        style?: string;
      };
    }
  ) {
    super();
  }
}
