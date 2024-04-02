type ImageGenerationMetadata = {
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: string;
  input: {
    prompt: string;
    negativePrompt: string;
    strength: number;
    steps: number;
    seed: number;
    model: string;
    scheduler: string;
    refiner?: string;
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
