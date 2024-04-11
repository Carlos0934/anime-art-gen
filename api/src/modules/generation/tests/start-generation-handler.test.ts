import { describe, test, vi, expect } from "vitest";

import { Context } from "@/core/context";
import { Exception, ExceptionType } from "@/core/exception";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { StartGenerationRequestHandler } from "../handlers/start-generation";
import { StartRequestGenerationEvent } from "../events";
import { ImageModels, ImageQualities } from "@/core/entities/image-generation";
import { User } from "@/core/entities/user";
import { UserMother } from "@/core/tests/utils/user-mother";

describe("StartGenerationRequestHandler", () => {
  const handler: StartGenerationRequestHandler =
    new StartGenerationRequestHandler();

  test("should handle the start of image generation requests", async () => {
    // Arrange
    const ctx: Context = createTestContext();

    const user = UserMother.createWithCredits(10); // Assuming user with 10 credits
    const event = new StartRequestGenerationEvent({
      params: {
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
      userId: user.id,
    });

    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(user);
    ctx.imageGeneratorClient.generateImage = vi
      .fn(ctx.imageGeneratorClient.generateImage)
      .mockResolvedValue({ taskId: "task_id" });
    const imageGeneratorClientSpy = vi.spyOn(
      ctx.imageGeneratorClient,
      "generateImage"
    );
    ctx.usersConnectionsKvStore.get = vi.fn().mockResolvedValue({
      connectionId: "connection_id",
    });

    ctx.wsManagement.postToConnection = vi.fn();

    const userRepositorySpy = vi.spyOn(ctx.userRepository, "update");
    const tasksUsersKvStoreSpy = vi.spyOn(ctx.tasksUsersKvStore, "set");

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.userRepository.getById).toHaveBeenCalledWith(user.id);
    expect(ctx.imageGeneratorClient.generateImage).toHaveBeenCalledWith(
      event.data.params,
      user.id
    );
    expect(ctx.userRepository.update).toHaveBeenCalledWith({
      ...user,
      credits: 9,
    }); // Check if credits were deducted
    expect(ctx.tasksUsersKvStore.set).toHaveBeenCalledWith("task_id", {
      taskId: "task_id",
      userId: user.id,
    });
    expect(ctx.wsManagement.postToConnection).toHaveBeenCalled();

    // Check if the user was updated correctly

    const updatedUser: User = userRepositorySpy.mock.calls[0][0];
    expect(updatedUser).toBeInstanceOf(User);
    expect(updatedUser.id).toBe(user.id);

    // Check if the correct task was saved

    const savedTask = tasksUsersKvStoreSpy.mock.calls[0][1];
    expect(savedTask).toEqual({ taskId: "task_id", userId: user.id });

    // Check if the correct image generation parameters were sent to the image generator client

    const imageGenerationParams = imageGeneratorClientSpy.mock.calls[0][0];
    expect(imageGenerationParams).toEqual(event.data.params);
  });

  test("should throw an error when the user is not found", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const event = new StartRequestGenerationEvent({
      params: {
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

    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(null);

    // Act
    try {
      await handler.handle(event, ctx);
    } catch (e: any) {
      // Assert
      expect(e).toBeInstanceOf(Exception);
      expect(e.message).toBe("User not found");
      expect(e.type).toBe(ExceptionType.NotFound);
    }
  });
});
