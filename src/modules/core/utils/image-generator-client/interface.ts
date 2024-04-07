import {
  ImageGenerationMetadata,
  ImageQualities,
} from "@/core/entities/image-generation";

export type GenerateImageInput = {
  height: number;
  width: number;
  prompt: string;
  negativePrompt?: string;
  strength?: number;
  steps?: number;
  seed?: number;
  model?: string;
  quality?: ImageQualities;
  style?: string;
};

export interface ImageGeneratorClient {
  generateImage(data: GenerateImageInput): Promise<{ taskId: string }>;
}
