import { describe, test, vi, expect } from "vitest";

import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { Exception, ExceptionType } from "@/core/exception";
import {
  RechargeCreditsEvent,
  RechargeCreditsHandler,
} from "../handlers/recharge-credits-handler";

describe.concurrent("RechargeCreditsHandler", () => {
  const handler: RechargeCreditsHandler = new RechargeCreditsHandler();

  test("should create a payment record when recharging credits", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();

    const creditsToAdd = 100;
    const amount = {
      value: 1000,
      currency: "USD",
    };
    const event = new RechargeCreditsEvent({ userEmail: user.email, amount });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(user);

    ctx.userRepository.update;

    ctx.paymentRepository.save = vi.fn(ctx.paymentRepository.save);
    ctx.creditsConverter.convertToCredits = vi.fn(() => creditsToAdd);
    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.paymentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        amount: amount.value,
        currency: amount.currency,
        credits: creditsToAdd,
      })
    );
  });

  test("should recharge credits to the user's account when provided with a valid user ID and credits amount", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();

    const creditsToAdd = 100;
    const amount = {
      value: 1000,
      currency: "USD",
    };
    const event = new RechargeCreditsEvent({ userEmail: user.email, amount });

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
    const invalidUserMail = "invalid@example.com";
    const amount = {
      value: 10000,
      currency: "USD",
    };
    const event = new RechargeCreditsEvent({
      userEmail: invalidUserMail,
      amount,
    });

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

    const creditsToAdd = 100;
    const amount = {
      value: creditsToAdd,
      currency: "EUR",
    };

    const event = new RechargeCreditsEvent({ userEmail: user.email, amount });

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
