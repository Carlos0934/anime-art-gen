import { ImageGeneration } from "@/core/entities/image-generation";
import { ImageGenerationRepository } from "../image-generation-repository";

import database from "@/core/config/db/database";
import { imageGenerations } from "@/core/config/db/schema";

export class DrizzleImageGenerationRepository
  implements ImageGenerationRepository
{
  constructor(private readonly db: typeof database) {}
  async save(data: ImageGeneration): Promise<void> {
    await this.db.insert(imageGenerations).values(data).execute();
  }
}
