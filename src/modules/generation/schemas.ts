import { ImageModels, ImageQualities } from "@/core/entities/image-generation";
import { z } from "zod";

export const GenerateImageInputSchema = z.object({
  height: z.number(),
  width: z.number(),
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  strength: z.number().optional(),
  steps: z.number().optional(),
  seed: z.number().optional(),
  model: z.nativeEnum(ImageModels),
  quality: z.nativeEnum(ImageQualities).optional(),
  style: z.string().optional(),
});
