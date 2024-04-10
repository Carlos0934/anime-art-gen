import { describe, test, vi, expect } from "vitest";
import {
  GetUserProfileEvent,
  GetUserProfileHandler,
} from "../handlers/get-user-profile";

import { Context } from "@/core/context";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { UserMother } from "@/core/tests/utils/user-mother";

describe("GetUserProfileHandler", () => {
  const handler: GetUserProfileHandler = new GetUserProfileHandler();

  test("should return user profile when provided with a valid user ID", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    ctx.userRepository.findById = vi
      .fn(ctx.userRepository.findById)
      .mockResolvedValue(user);
    const event = new GetUserProfileEvent({ userId: user.id });

    // Act
    const result = await handler.handle(event, ctx);

    // Assert
    expect(result.user).toEqual({
      id: user.id,
      email: user.email,
      credits: user.credits,
      createdAt: user.createdAt,
    });
  });

  test("should return null when provided with an invalid user ID", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const userId = "invalid_user_id";
    ctx.userRepository.findById = vi
      .fn(ctx.userRepository.findById)
      .mockResolvedValue(null);

    const event = new GetUserProfileEvent({ userId });

    // Act
    const result = await handler.handle(event, ctx);

    // Assert
    expect(result.user).toBeNull();
  });
});
