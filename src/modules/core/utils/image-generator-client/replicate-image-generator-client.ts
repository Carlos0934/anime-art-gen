import Replicate from "replicate";
import { GenerateImageInput, ImageGeneratorClient } from "./interface";
import { ImageModels } from "@/core/entities/image-generation";
import { Exception, ExceptionType } from "@/core/exception";

export class ReplicateImageGeneratorClient implements ImageGeneratorClient {
  private readonly replicate: Replicate;
  private readonly modelsMap: Record<
    ImageModels,
    { model: string; version: string }
  > = {
    "ani-imagine-xl": {
      model: "cjwbw/animagine-xl-3.1",
      version:
        "6afe2e6b27dad2d6f480b59195c221884b6acc589ff4d05ff0e5fc058690fbb9",
    },
  };
  constructor() {
    this.replicate = new Replicate();
  }
  async generateImage(
    data: GenerateImageInput,
    userId: string
  ): Promise<{ taskId: string }> {
    return this.createPrediction(data, userId).catch(() => {
      throw new Exception(
        "Failed to create prediction",
        ExceptionType.BadArgument
      );
    });
  }

  private async createPrediction(data: GenerateImageInput, userId: string) {
    const { model, version } = this.modelsMap[data.model as ImageModels];
    console.log("model", model);
    const input = {
      prompt: data.prompt,
      height: data.height,
      width: data.width,

      negative_prompt: data.negativePrompt,
      guidance_scale: data.strength,
      steps: data.steps,
      seed: data.seed,
      quality_selector: data.quality,
      style_selector: data.style,
    };
    const callbackUrl = process.env.REPLICATE_CALLBACK_URL! + `/${userId}`;

    const result = await this.replicate.predictions.create({
      model,
      version,
      input,
      webhook: callbackUrl,
      webhook_events_filter: ["completed"],
    });
    return { taskId: result.id };
  }
}
