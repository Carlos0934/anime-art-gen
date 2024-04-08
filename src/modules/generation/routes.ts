import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  RequestGenerationCallbackSchema,
  RequestGenerationSchema,
} from "./schemas";
import { validateWebhook } from "replicate";
import { eventBus } from "@/core/eventBus";
import {
  RequestGenerationCompleteEvent,
  RequestGenerationEvent,
} from "./events";
import {
  ImageModels,
  modelQualityMap,
  modelStyleMap,
} from "@/core/entities/image-generation";

const generationRoutes = new Hono();

generationRoutes.post(
  "/callback",
  zValidator("json", RequestGenerationCallbackSchema),
  async (ctx) => {
    const isValid = await validateWebhook(
      ctx.req.raw,
      process.env.REPLICATE_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return ctx.json({ message: "Invalid webhook" }, 401);
    }

    const data = ctx.req.valid("json");
    const { id, output, logs, input } = data;

    const seed = extractSeedFromLogs(logs);
    const model = ImageModels.AniImagineXL;
    const quality = modelQualityMap[model][input.quality_selector];
    const style = modelStyleMap[model][input.style_selector];

    const event = new RequestGenerationCompleteEvent({
      imageUrl: output,

      taskId: id,
      input: {
        height: input.height,
        width: input.width,
        prompt: input.prompt,
        model,
        quality,
        style,
        seed,
        steps: input.num_inference_steps,
        strength: input.guidance_scale,
        negativePrompt: input.negative_prompt,
      },
    });

    await eventBus.publish(event);

    return ctx.json({ message: "Hello, World!" });
  }
);

generationRoutes.post(
  "/generate-image",
  jwt({ secret: process.env.JWT_SECRET! }),
  zValidator("json", RequestGenerationSchema),
  async (ctx) => {
    const params = ctx.req.valid("json");
    const { userId } = ctx.get("jwtPayload") as { userId: string };

    const event = new RequestGenerationEvent({ userId, params });
    await eventBus.publish(event);

    return ctx.json({ message: "Image generation started" });
  }
);

export default generationRoutes;
