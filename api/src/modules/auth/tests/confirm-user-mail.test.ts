import { describe, test, vi, expect, beforeEach, beforeAll } from "vitest";
import {
  ConfirmUserMailEvent,
  ConfirmUserMailHandler,
} from "../handlers/confirm-user-mail";
import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { Exception, ExceptionType } from "@/core/exception";
import { Context } from "@/core/context";

describe.concurrent("ConfirmUserMailHandler", () => {
  const handler: ConfirmUserMailHandler = new ConfirmUserMailHandler();

  test("should confirm user email when valid token is provided", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    const token = "valid-token";
    const event = new ConfirmUserMailEvent({ token });

    ctx.jwtService.verify = vi.fn().mockReturnValue({ email: user.email });
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);
    ctx.userRepository.update = vi
      .fn(ctx.userRepository.update)
      .mockResolvedValue();

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(user.emailVerified).toBeInstanceOf(Date);
    expect(ctx.userRepository.update).toHaveBeenCalledWith(user);
  });

  test("should throw an exception when invalid token is provided", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const token = "invalid-token";
    const event = new ConfirmUserMailEvent({ token });

    ctx.jwtService.verify = vi.fn().mockReturnValue(null);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("Invalid token", ExceptionType.BadArgument)
    );
  });

  test("should throw an exception when user is not found", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const token = "valid-token";
    const event = new ConfirmUserMailEvent({ token });

    ctx.jwtService.verify = vi
      .fn()
      .mockReturnValue({ email: "nonexistent@example.com" });
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(null);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("User not found", ExceptionType.NotFound)
    );
  });

  test("should not update user emailVerified if already verified", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createVerifiedUser();
    const token = "valid-token";
    const event = new ConfirmUserMailEvent({ token });

    ctx.jwtService.verify = vi.fn().mockReturnValue({ email: user.email });
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(user.emailVerified).toBeInstanceOf(Date);
    expect(ctx.userRepository.update).not.toHaveBeenCalled();
  });
});
