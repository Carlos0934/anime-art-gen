import { Context } from "@/core/context";

import { vi } from "vitest";

export const createTestContext = (): Context => {
  return {
    userRepository: {
      getByEmail: vi.fn(),
      save: vi.fn(),
      getById: vi.fn(),
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
    imageGeneratorClient: {
      generateImage: vi.fn(),
    },
    imageGenerationRepository: {
      save: vi.fn(),
      getByUserId: vi.fn(),
    },
    pubNotificationService: {
      publish: vi.fn(),
    },
    fileService: {
      upload: vi.fn(),
    },
    tasksUsersKvStore: {
      delete: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    },
    paymentRepository: {
      save: vi.fn(),
      getPaymentsByUserId: vi.fn(),
    },
    usersConnectionsKvStore: {
      delete: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    },
  };
};
