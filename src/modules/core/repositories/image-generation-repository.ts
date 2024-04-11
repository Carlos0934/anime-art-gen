import { ImageGeneration } from "../entities/image-generation";

export interface ImageGenerationRepository {
  save(data: ImageGeneration): Promise<void>;
  getByUserId(userId: string): Promise<ImageGeneration[]>;
}
