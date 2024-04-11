import { ImageGeneration } from "@/core/entities/image-generation";
import { ImageGenerationRepository } from "../image-generation-repository";

import database from "@/core/config/db/database";
import { imageGenerations } from "@/core/config/db/schema";
import { eq } from "drizzle-orm";

export class DrizzleImageGenerationRepository
  implements ImageGenerationRepository
{
  constructor(private readonly db: typeof database) {}
  async save(data: ImageGeneration): Promise<void> {
    await this.db.insert(imageGenerations).values(data).execute();
  }
  async getByUserId(userId: string): Promise<ImageGeneration[]> {
    return this.db
      .select()
      .from(imageGenerations)
      .where(eq(imageGenerations.userId, userId))
      .execute()
      .then((res) =>
        res.map(
          (r) =>
            new ImageGeneration({
              createdAt: r.createdAt,
              url: r.url,
              id: r.id,
              userId: r.userId,
              metadata: r.metadata as ImageGeneration["metadata"],
            })
        )
      );
  }
}
