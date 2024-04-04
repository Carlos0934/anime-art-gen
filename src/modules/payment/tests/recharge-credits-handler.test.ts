import { describe, test, vi, expect } from "vitest";

import { UserMother } from "@/core/tests/utils/user-mother-";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { Exception, ExceptionType } from "@/core/exception";
import {
  RechargeCreditsEvent,
  RechargeCreditsHandler,
} from "../handlers/recharge-credits-handler";
import { CREDITS_CONVERSION_RATE } from "@/core/utils/credits-converter/interface";

describe.concurrent("RechargeCreditsHandler", () => {
  const handler: RechargeCreditsHandler = new RechargeCreditsHandler();

  test("should recharge credits to the user's account when provided with a valid user ID and credits amount", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();
    const userId = user.id;
    const creditsToAdd = 100;
    const amount = {
      value: CREDITS_CONVERSION_RATE * creditsToAdd,
      type: "USD" as const,
    };
    const event = new RechargeCreditsEvent({ userId, amount });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(user);

    ctx.userRepository.update = vi.fn(ctx.userRepository.update);

    ctx.creditsConverter.convertToCredits = vi.fn(() => creditsToAdd);

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(user.credits).toBe(creditsToAdd);
    expect(ctx.userRepository.update).toHaveBeenCalledWith(user);
  });

  test("should throw an error when provided with an invalid user ID", async () => {
    // Arrange
    const ctx = createTestContext();
    const userId = "invalid_user_id";
    const creditsToAdd = 100;
    const amount = {
      value: CREDITS_CONVERSION_RATE * creditsToAdd,
      type: "USD" as const,
    };
    const event = new RechargeCreditsEvent({ userId, amount });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(null);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("User not found", ExceptionType.NotFound)
    );
  });

  test("should throw an error when provided with an unsupported currency", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();
    const userId = user.id;
    const creditsToAdd = 100;
    const amount = {
      value: creditsToAdd,
      type: "EUR" as const,
    } as any; // EUR is not supported

    const event = new RechargeCreditsEvent({ userId, amount });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(user);

    ctx.creditsConverter.convertToCredits = vi.fn(() => {
      throw new Exception("Unsupported currency", ExceptionType.Forbidden);
    });

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("Unsupported currency", ExceptionType.Forbidden)
    );
  });
});
