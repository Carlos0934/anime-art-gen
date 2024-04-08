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

  input: {
    prompt: string;
    negativePrompt?: string;
    strength: number;
    steps: number;
    seed: number;
    model: ImageModels;
    quality: ImageQualities;
    style?: string;
  };
};

export class ImageGeneration {
  id: string;
  url: string;
  userId: string;
  metadata: ImageGenerationMetadata;
  createdAt: Date;
  constructor({
    userId,
    id,
    metadata,
    url,
    createdAt,
  }: {
    id: string;
    url: string;
    userId: string;
    metadata: ImageGenerationMetadata;
    createdAt: string | Date | number;
  }) {
    this.id = id;
    this.url = url;
    this.userId = userId;
    this.metadata = metadata;
    this.createdAt = new Date(createdAt);
  }
}
