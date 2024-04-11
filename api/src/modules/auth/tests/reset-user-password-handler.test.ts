import { describe, test, vi, expect } from "vitest";
import {
  ResetUserPasswordEvent,
  ResetUserPasswordHandler,
} from "../handlers/reset-user-password";
import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { Exception, ExceptionType } from "@/core/exception";

describe.concurrent("ResetUserPasswordHandler", () => {
  const handler: ResetUserPasswordHandler = new ResetUserPasswordHandler();

  test("should reset user password when provided valid token, old password, and new password", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();
    const token = "valid_token";
    const oldPassword = "old_password";
    const newPassword = "new_password";
    const event = new ResetUserPasswordEvent({
      token,
      oldPassword,
      newPassword,
    });

    ctx.jwtService.verify = vi
      .fn(ctx.jwtService.verify)
      .mockReturnValue(Promise.resolve({ email: user.email })) as any;
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);
    ctx.passwordHasher.comparePassword = vi
      .fn(ctx.passwordHasher.comparePassword)
      .mockResolvedValue(true);
    ctx.passwordHasher.hashPassword = vi
      .fn(ctx.passwordHasher.hashPassword)
      .mockResolvedValue(newPassword);
    ctx.userRepository.update = vi.fn(ctx.userRepository.update);

    // Act
    await handler.handle(event, ctx);

    // Assert
    expect(ctx.userRepository.update).toHaveBeenCalledWith(user);
    expect(user.password).toBe(newPassword);
  });

  test("should throw an error when provided with an invalid token", async () => {
    // Arrange
    const ctx = createTestContext();
    const token = "invalid_token";
    const event = new ResetUserPasswordEvent({
      token,
      oldPassword: "old_password",
      newPassword: "new_password",
    });

    ctx.jwtService.verify = vi
      .fn(ctx.jwtService.verify)
      .mockReturnValue(null) as any;

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("Invalid token", ExceptionType.BadArgument)
    );
  });

  test("should throw an error when the user is not found", async () => {
    // Arrange
    const ctx = createTestContext();
    const token = "valid_token";
    const event = new ResetUserPasswordEvent({
      token,
      oldPassword: "old_password",
      newPassword: "new_password",
    });

    ctx.jwtService.verify = vi
      .fn(ctx.jwtService.verify)
      .mockReturnValue({ email: "nonexistent@example.com" }) as any;
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(null);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("User not found", ExceptionType.NotFound)
    );
  });

  test("should throw an error when provided with an invalid old password", async () => {
    // Arrange
    const ctx = createTestContext();
    const user = UserMother.createDefaultUser();
    const token = "valid_token";
    const event = new ResetUserPasswordEvent({
      token,
      oldPassword: "invalid_old_password",
      newPassword: "new_password",
    });

    ctx.jwtService.verify = vi
      .fn(ctx.jwtService.verify)
      .mockReturnValue({ email: user.email }) as any;
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);
    ctx.passwordHasher.comparePassword = vi
      .fn(ctx.passwordHasher.comparePassword)
      .mockResolvedValue(false);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      new Exception("Invalid password", ExceptionType.Unauthorized)
    );
  });
});
