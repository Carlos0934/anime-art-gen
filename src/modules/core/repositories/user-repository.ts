import { User } from "../../modules/core/entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  userExist(email: string): Promise<boolean>;
  save(user: User): Promise<void>;

  update(user: User): Promise<void>;

  delete(user: User): Promise<void>;
}
