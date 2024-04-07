import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GenerateImageInputSchema } from "./schemas";
import { StartGenerationEvent } from "./handlers/start-generation";
import { eventBus } from "@/core/eventBus";

const generationRoutes = new Hono();

generationRoutes.post("/callback", async (ctx) => {
  const data = await ctx.req.json();
  console.log(data);
  return ctx.json({ message: "Hello, World!" });
});

generationRoutes.post(
  "/generate-image",
  zValidator("json", GenerateImageInputSchema),
  async (ctx) => {
    const userId = crypto.randomUUID();

    const params = ctx.req.valid("json");

    const event = new StartGenerationEvent({ userId, params });
    await eventBus.publish(event);

    return ctx.json({ message: "Image generation started" });
  }
);
export default generationRoutes;
