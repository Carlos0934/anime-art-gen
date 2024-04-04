import { Context } from "@/core/context";
import { vi } from "vitest";

export const createTestContext = (): Context => {
  return {
    userRepository: {
      findByEmail: vi.fn(),
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      userExists: vi.fn(),
    },
    mailer: {
      send: vi.fn(),
    },
    passwordHasher: {
      hashPassword: vi.fn(),
      comparePassword: vi.fn(),
    },
    jwtService: {
      sign: vi.fn(),
      verify: vi.fn(),
    },
    creditsConverter: {
      convertToCredits: vi.fn(),
    },
  };
};
