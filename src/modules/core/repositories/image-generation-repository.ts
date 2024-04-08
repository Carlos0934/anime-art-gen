import { ImageGeneration } from "../entities/image-generation";

export interface ImageGenerationRepository {
  save(data: ImageGeneration): Promise<void>;
}
