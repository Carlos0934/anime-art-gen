import { describe, test, vi, expect } from "vitest";
import {
  GetImageGenerationsEvent,
  GetImageGenerationsHandler,
} from "../handlers/get-generations";
import { ImageGeneration, ImageModels } from "@/core/entities/image-generation";

import { Context } from "@/core/context";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { UserMother } from "@/core/tests/utils/user-mother";

describe("GetImageGenerationsHandler", () => {
  const handler: GetImageGenerationsHandler = new GetImageGenerationsHandler();

  test("should return image generations when provided with a valid user ID", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    const imageGenerations: ImageGeneration[] = [
      new ImageGeneration({
        id: "1",
        url: "url1",
        userId: user.id,
        createdAt: new Date(),
        metadata: {
          height: 100,
          width: 100,
          input: {
            model: ImageModels.AniImagineXL,

            style: "style",
            prompt: "prompt",
            quality: 1,
            seed: 1,
            steps: 1,
            strength: 1,
            negativePrompt: "negativePrompt",
          },
        },
      }),
      new ImageGeneration({
        id: "2",
        url: "url2",
        userId: user.id,
        createdAt: new Date(),
        metadata: {
          height: 100,
          width: 100,
          input: {
            model: ImageModels.AniImagineXL,

            style: "style",
            prompt: "prompt",
            quality: 1,
            seed: 1,
            steps: 1,
            strength: 1,
            negativePrompt: "negativePrompt",
          },
        },
      }),
    ];

    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(user);
    ctx.imageGenerationRepository.getByUserId = vi
      .fn(ctx.imageGenerationRepository.getByUserId)
      .mockResolvedValue(imageGenerations);
    const event = new GetImageGenerationsEvent({ userId: user.id });

    // Act
    const result = await handler.handle(event, ctx);

    // Assert
    expect(result).toEqual(imageGenerations);
  });

  test("should throw an error when provided with an invalid user ID", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const userId = "invalid_user_id";
    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(null); // Mocking user retrieval
    const event = new GetImageGenerationsEvent({ userId });

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrowError(
      "User not found"
    );
  });
});
