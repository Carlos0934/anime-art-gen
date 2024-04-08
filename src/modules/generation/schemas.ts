import { ImageModels, ImageQualities } from "@/core/entities/image-generation";
import { z } from "zod";

export const RequestGenerationSchema = z.object({
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

export const RequestEventGenerationCompleteSchema = z.object({
  taskId: z.string(),
  imageUrl: z.string(),
  input: RequestGenerationSchema,
});
export const RequestGenerationCallbackSchema = z.object({
  id: z.string(),
  output: z.string(),
  logs: z.string(),
  input: z.object({
    width: z.number(),
    height: z.number(),
    prompt: z.string(),
    guidance_scale: z.number(),
    style_selector: z.string(),
    negative_prompt: z.string().optional(),
    quality_selector: z.string(),
    num_inference_steps: z.number(),
  }),
});
