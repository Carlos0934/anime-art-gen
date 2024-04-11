import { describe, test, vi, expect } from "vitest";
import { FailGenerationHandler } from "../handlers/fail-generation";
import { Context } from "@/core/context";
import { FailRequestGenerationEvent } from "../events";
import { createTestContext } from "@/core/tests/utils/create-test-context";

describe("FailGenerationHandler", () => {
  const handler: FailGenerationHandler = new FailGenerationHandler();

  test("should handle the failure of image generation requests", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const taskId = "task_id";
    const error = "Some error message";
    const event = new FailRequestGenerationEvent({ taskId, error });

    ctx.tasksUsersKvStore.get = vi
      .fn(ctx.tasksUsersKvStore.get)
      .mockResolvedValue({ taskId, userId: "user_id" });

    const deleteSpy = vi.spyOn(ctx.tasksUsersKvStore, "delete");

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.tasksUsersKvStore.get).toHaveBeenCalledWith(taskId);
    expect(ctx.tasksUsersKvStore.delete).toHaveBeenCalledWith(taskId);

    // Check if the correct task was deleted
    expect(deleteSpy).toHaveBeenCalledWith(taskId);
  });

  test("should not do anything if the task is not found", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const taskId = "nonexistent_task_id";
    const error = "Some error message";
    const event = new FailRequestGenerationEvent({ taskId, error });

    ctx.tasksUsersKvStore.get = vi
      .fn(ctx.tasksUsersKvStore.get)
      .mockResolvedValue(null);
    ctx.tasksUsersKvStore.delete = vi.fn(ctx.tasksUsersKvStore.delete);
    ctx.pubNotificationService.publish = vi.fn(
      ctx.pubNotificationService.publish
    );

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.tasksUsersKvStore.get).toHaveBeenCalledWith(taskId);
    expect(ctx.tasksUsersKvStore.delete).not.toHaveBeenCalled();
    expect(ctx.pubNotificationService.publish).not.toHaveBeenCalled();
  });
});
