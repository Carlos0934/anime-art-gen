import { describe, test, vi, expect } from "vitest";
import {
  RegisterUserEvent,
  RegisterUserHandler,
} from "../handlers/register-user";
import { UserMother } from "@/core/tests/utils/user-mother";
import { createTestContext } from "@/core/tests/utils/create-test-context";
import { UserAlreadyExistException } from "../exceptions/user-already-exist-error";
import { Context } from "@/core/context";

describe.concurrent("RegisterUserHandler", () => {
  const handler: RegisterUserHandler = new RegisterUserHandler();

  test("should register a new user when provided valid data", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    const event = new RegisterUserEvent({
      email: user.email,
      password: user.password!,
    });
    ctx.userRepository.userExists = vi
      .fn(ctx.userRepository.userExists)
      .mockResolvedValue(false);
    ctx.userRepository.save = vi
      .fn(ctx.userRepository.save)
      .mockResolvedValue();

    // Act
    await handler.handle(event, ctx);

    // Assert

    expect(ctx.userRepository.save).toBeCalled();
  });

  test("should throw an error when trying to register an already existing user", async () => {
    // Arrange
    const ctx: Context = createTestContext();
    const user = UserMother.createDefaultUser();
    const event = new RegisterUserEvent({
      email: user.email,
      password: user.password!,
    });
    ctx.userRepository.userExists = vi
      .fn(ctx.userRepository.userExists)
      .mockResolvedValue(true);

    // Act & Assert
    await expect(handler.handle(event, ctx)).rejects.toThrow(
      UserAlreadyExistException
    );
  });
});
