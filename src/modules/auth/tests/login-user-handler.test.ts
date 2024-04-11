import { describe, test, vi, expect, beforeEach } from "vitest";

import { LoginUserEvent, LoginUserHandler } from "../handlers/login-user";

import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exeception";
import { UserAlreadyExistException } from "../exceptions/user-already-exist-error";
import { EmailNotVerifiedException } from "../exceptions/email-not-verified-exeption";
import { Context } from "@/core/context";

describe.concurrent("LoginUserHandler", () => {
  const handler: LoginUserHandler = new LoginUserHandler();

  test("should return a token when the user is logged in", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createVerifiedUser();
    const token = "token";
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);

    ctx.passwordHasher.comparePassword = vi
      .fn(ctx.passwordHasher.comparePassword)
      .mockResolvedValue(true);

    ctx.jwtService.sign = vi.fn(ctx.jwtService.sign).mockReturnValue(token);

    const event = new LoginUserEvent({
      email: user.email,
      password: user.password!,
    });

    // Act
    const result = await handler.handle(event, ctx);

    // Assert
    expect(result).toStrictEqual({ token });
  });

  test("should throw an error when the user is not found", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(null);

    const event = new LoginUserEvent({
      email: user.email,
      password: user.password!,
    });

    // Act
    try {
      await handler.handle(event, ctx);
    } catch (error) {
      // Assert

      expect(error).toBeInstanceOf(InvalidCredentialsException);
    }
  });

  test("should throw an error when the password is invalid", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createVerifiedUser();
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);

    ctx.passwordHasher.comparePassword = vi
      .fn(ctx.passwordHasher.comparePassword)
      .mockResolvedValue(false);

    const event = new LoginUserEvent({
      email: user.email,
      password: user.password!,
    });

    // Act
    try {
      await handler.handle(event, ctx);
    } catch (error) {
      // Assert

      expect(error).toBeInstanceOf(InvalidCredentialsException);
    }
  });

  test("should throw an error when the user is not verified", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);

    const event = new LoginUserEvent({
      email: user.email,
      password: user.password!,
    });

    // Act
    try {
      await handler.handle(event, ctx);
    } catch (error) {
      // Assert

      expect(error).toBeInstanceOf(EmailNotVerifiedException);
    }
  });

  test("should throw an error when the user already exists", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createVerifiedUser();
    ctx.userRepository.getByEmail = vi
      .fn(ctx.userRepository.getByEmail)
      .mockResolvedValue(user);

    ctx.passwordHasher.comparePassword = vi
      .fn(ctx.passwordHasher.comparePassword)
      .mockResolvedValue(true);

    ctx.jwtService.sign = vi.fn(ctx.jwtService.sign).mockReturnValue("token");

    const event = new LoginUserEvent({
      email: user.email,
      password: user.password!,
    });

    // Act
    try {
      await handler.handle(event, ctx);
    } catch (error) {
      // Assert

      expect(error).toBeInstanceOf(UserAlreadyExistException);
    }
  });
});
