import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  RequestEventGenerationCompleteSchema,
  RequestGenerationCallbackSchema,
  RequestGenerationSchema,
} from "./schemas";
import { validateWebhook } from "replicate";
import { eventBus } from "@/core/eventBus";
import {
  CompleteRequestGenerationEvent,
  FailRequestGenerationEvent,
  StartRequestGenerationEvent,
} from "./events";
import {
  ImageModels,
  ImageQualities,
  ImageStyles,
  modelQualityMap,
  modelStyleMap,
} from "@/core/entities/image-generation";
import { extractSeedFromLogs } from "./utils/extract-seed-from-logs";
import { GetImageGenerationsEvent } from "./handlers/get-generations";

const generationRoutes = new Hono();

generationRoutes.post(
  "/callback/:userId",

  async (ctx) => {
    const isValid = await validateWebhook(
      ctx.req.raw.clone(),
      process.env.REPLICATE_SIGNING_KEY!
    );

    if (!isValid) {
      return ctx.json({ message: "Invalid webhook" }, 401);
    }

    const payload = await ctx.req.json();
    const result = RequestGenerationCallbackSchema.safeParse(payload);
    if (!result.success) {
      console.log(result.error);
      return ctx.json({ message: "Invalid data" }, 400);
    }

    const { id, output, logs, input, status } = result.data;

    if (status !== "succeeded") {
      const event = new FailRequestGenerationEvent({
        taskId: id,
        error: "Image generation failed",
      });
      await eventBus.publish(event);
      return ctx.json({ message: "Image generation failed" }, 400);
    }

    const seed = extractSeedFromLogs(logs);
    const model = ImageModels.AniImagineXL;
    const quality = input.quality_selector
      ? modelQualityMap[model][input.quality_selector]
      : ImageQualities.Medium;
    const style = input.style_selector
      ? modelStyleMap[model][input.style_selector]
      : ImageStyles.None;

    const userId = ctx.req.param("userId");
    const event = new CompleteRequestGenerationEvent({
      imageUrl: output,
      userId,
      taskId: id,
      input: {
        height: input.height,
        width: input.width,
        prompt: input.prompt,
        model,
        quality,
        style,
        seed,
        steps: input.num_inference_steps || 27,
        strength: input.guidance_scale,
        negativePrompt: input.negative_prompt,
      },
    });

    await eventBus.publish(event);

    return ctx.status(201);
  }
);

generationRoutes.post(
  "/generate-image",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
  zValidator("json", RequestGenerationSchema),
  async (ctx) => {
    const params = ctx.req.valid("json");

    const { userId } = ctx.get("jwtPayload") as { userId: string };

    const event = new StartRequestGenerationEvent({ userId, params });
    await eventBus.publish(event);

    return ctx.json({ message: "Image generation started" });
  }
);

generationRoutes.get(
  "/images/:userId",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
  async (ctx) => {
    const { userId } = ctx.get("jwtPayload") as { userId: string };

    const event = new GetImageGenerationsEvent({ userId });
    const result = await eventBus.publish(event);

    return ctx.json(result);
  }
);
export default generationRoutes;
