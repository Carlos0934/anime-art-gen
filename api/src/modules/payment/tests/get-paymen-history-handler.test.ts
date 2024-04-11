import { describe, test, vi, expect } from "vitest";

import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { Exception, ExceptionType } from "@/core/exception";
import {
  GetPaymentHistoryEvent,
  GetPaymentHistoryHandler,
} from "../handlers/get-payment-history";

describe.concurrent("GetPaymentHistoryHandler", () => {
  const handler: GetPaymentHistoryHandler = new GetPaymentHistoryHandler();

  test("should return a list of payment history when provided with a valid user ID", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();

    const payments = [
      {
        id: "payment-id",
        userId: user.id,
        amount: 1000,
        currency: "USD",
        credits: 100,
        createdAt: new Date(),
      },
    ];

    const event = new GetPaymentHistoryEvent({ userId: user.id });

    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(user);

    ctx.paymentRepository.getPaymentsByUserId = vi
      .fn()
      .mockResolvedValue(payments);

    // Act
    const result = await handler.handle(event, ctx);

    // Assert
    expect(result).toStrictEqual({ payments });
  });

  test("should throw an exception when provided with an invalid user ID", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();

    const event = new GetPaymentHistoryEvent({ userId: user.id });

    ctx.userRepository.getById = vi
      .fn(ctx.userRepository.getById)
      .mockResolvedValue(null);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("User not found", ExceptionType.NotFound)
    );
  });
});
