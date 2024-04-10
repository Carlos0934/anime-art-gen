import { describe, test, vi, expect } from "vitest";
import {
  SendPasswordResetEvent,
  SendPasswordResetHandler,
} from "../handlers/send-password-reset";
import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";

describe.concurrent("SendPasswordResetHandler", () => {
  const handler: SendPasswordResetHandler = new SendPasswordResetHandler();

  test("should send password reset email when provided with a valid email address", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();
    const email = user.email;
    const event = new SendPasswordResetEvent({ email });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(user);
    ctx.jwtService.sign = vi
      .fn(ctx.jwtService.sign)
      .mockReturnValue("valid_token");
    ctx.mailer.send = vi.fn(ctx.mailer.send);

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.mailer.send).toHaveBeenCalled();
  });

  test("should not send password reset email when the user is not found", async () => {
    // Arrange
    const ctx = createTestContext();
    const email = "nonexistent@example.com";
    const event = new SendPasswordResetEvent({ email });

    ctx.userRepository.findByEmail = vi
      .fn(ctx.userRepository.findByEmail)
      .mockResolvedValue(null);
    ctx.jwtService.sign = vi.fn(ctx.jwtService.sign);
    ctx.mailer.send = vi.fn(ctx.mailer.send);

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.mailer.send).not.toHaveBeenCalled();
  });
});
