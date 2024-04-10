import { describe, test, vi, expect } from "vitest";
import { CompleteGenerationHandler } from "../handlers/complete-generation";
import { Context } from "@/core/context";
import {
  ImageGeneration,
  ImageModels,
  ImageQualities,
} from "@/core/entities/image-generation";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import {
  CompleteRequestGenerationEvent,
  RequestGenerationCompletedEvent,
} from "../events";

describe("CompleteGenerationHandler", () => {
  const handler: CompleteGenerationHandler = new CompleteGenerationHandler();

  test("should handle the completion of image generation requests", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const event = new CompleteRequestGenerationEvent({
      taskId: "task_id",
      imageUrl: "https://example.com/image.jpg",
      input: {
        height: 100,
        width: 100,
        prompt: "Prompt",
        negativePrompt: "Negative Prompt",
        strength: 0.7,
        steps: 10,
        seed: 0,
        model: ImageModels.AniImagineXL,
        quality: ImageQualities.High,
        style: "style_name",
      },
      userId: "user_id",
    });

    const saveImageSpy = vi.spyOn(ctx.imageGenerationRepository, "save");

    const publishSpy = vi.spyOn(ctx.pubNotificationService, "publish");
    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.imageGenerationRepository.save).toHaveBeenCalled();
    expect(ctx.pubNotificationService.publish).toHaveBeenCalled();

    // Check if the correct image generation entity was saved
    const savedImage: ImageGeneration = saveImageSpy.mock.calls[0][0];
    expect(savedImage).toBeInstanceOf(ImageGeneration);
    expect(savedImage.url).toBe("https://example.com/image.jpg");
    expect(savedImage.userId).toBe("user_id");
    expect(savedImage.metadata).toEqual({
      height: 100,
      width: 100,
      input: {
        prompt: "Prompt",
        negativePrompt: "Negative Prompt",
        strength: 0.7,
        steps: 10,
        seed: 0,
        model: ImageModels.AniImagineXL,
        quality: ImageQualities.High,
        style: "style_name",
      },
    });

    // Check if the correct event was published
    const publishedEvent = publishSpy.mock
      .calls[0][0] as RequestGenerationCompletedEvent;
    expect(publishedEvent).toBeInstanceOf(RequestGenerationCompletedEvent);
    expect(publishedEvent.data.taskId).toBe("task_id");
    expect(publishedEvent.data.imageId).toBe(savedImage.id);
    expect(publishedEvent.data.userId).toBe("user_id");
  });
});
