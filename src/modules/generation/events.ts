import { ImageModels, ImageQualities } from "@/core/entities/image-generation";
import { Event } from "@/core/handler";
import { GenerateImageInput } from "@/core/utils/image-generator-client/interface";

export enum GenerationEvents {
  ImageGenerationRequest = "generation.image-generation-request",
  ImageGenerationStart = "generation.image-generation-start",
  ImageGenerationComplete = "generation.image-generation-complete",
}

// For when the image generation request is received and is published to the the queue
export class RequestGenerationEvent extends Event {
  name = GenerationEvents.ImageGenerationRequest;
  constructor(
    public readonly data: { userId: string; params: GenerateImageInput }
  ) {
    super();
  }
}

// For when the image generation is complete and callback is received from the webhook
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

export class RequestGenerationStartedEvent extends Event {
  name = GenerationEvents.ImageGenerationStart;
  constructor(public readonly data: { userId: string; taskId: string }) {
    super();
  }
}

export class RequestGenerationCompletedEvent extends Event {
  name = GenerationEvents.ImageGenerationComplete;
  constructor(
    public readonly data: { userId: string; taskId: string; imageId: string }
  ) {
    super();
  }
}
