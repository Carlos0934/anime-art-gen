import { User } from "../entities/user";

export interface UserRepository {
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
  userExists(email: string): Promise<boolean>;
  save(user: User): Promise<void>;

  update(user: User): Promise<void>;

  delete(user: User): Promise<void>;
}
