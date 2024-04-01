import { UserRepository } from "./repositories/user-repository";

export type Context = {
  userRepository: UserRepository;
};
