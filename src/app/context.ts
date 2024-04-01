import db from "../infra/config/db/database";
import { DrizzleUserRepository } from "../infra/repositories/user-repository";
import { Context } from "../domain/context";

export const createContext = (): Context => {
  const userRepository = new DrizzleUserRepository(db);
  return {
    userRepository,
  };
};
