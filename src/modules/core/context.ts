import db from "./config/db/database";
import { Mailer } from "./utils/mailer/interface";
import { ResendMailer } from "./utils/mailer/resend-mailer";
import { DrizzleUserRepository } from "./repositories/drizzle/user-repository";
import { UserRepository } from "./repositories/user-repository";
import { PasswordHasher } from "./utils/password-hasher/interface";
import { CryptoPasswordHasher } from "./utils/password-hasher/crypto-password-hasher";
import { JwtService } from "./utils/jwt-service/jwt-service";

export type Context = {
  readonly userRepository: UserRepository;
  readonly mailer: Mailer;
  readonly passwordHasher: PasswordHasher;
  readonly jwtService: JwtService;
};

export const createContext = (): Context => {
  const userRepository = new DrizzleUserRepository(db);
  const resendMailer = new ResendMailer();
  const cryptoPasswordHasher = new CryptoPasswordHasher();
  const jwtService = new JwtService();
  return {
    userRepository,
    mailer: resendMailer,
    passwordHasher: cryptoPasswordHasher,
    jwtService,
  };
};
