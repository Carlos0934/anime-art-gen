export enum ImageModels {
  AniImagineXL = "ani-imagine-xl",
}

export enum ImageQualities {
  Low = 1,
  Medium = 2,
  High = 3,
}

export type ImageGenerationMetadata = {
  width: number;
  height: number;
  createdAt: string;
  input: {
    prompt: string;
    negativePrompt: string;
    strength: number;
    steps: number;
    seed: number;
    model: ImageModels;
    quality: ImageQualities;
    style: string;
  };
};

export class ImageGeneration {
  id: string;
  url: string;
  userId: string;
  metadata: ImageGenerationMetadata;

  constructor({
    accountId,
    id,
    metadata,
    url,
  }: {
    id: string;
    url: string;
    accountId: string;
    metadata: ImageGenerationMetadata;
  }) {
    this.id = id;
    this.url = url;
    this.userId = accountId;
    this.metadata = metadata;
  }
}
