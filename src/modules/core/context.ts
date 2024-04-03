import db from "./config/db/database";
import { Mailer } from "./utils/mailer/interface";
import { DrizzleUserRepository } from "./repositories/drizzle/user-repository";
import { UserRepository } from "./repositories/user-repository";
import { PasswordHasher } from "./utils/password-hasher/interface";
import { CryptoPasswordHasher } from "./utils/password-hasher/crypto-password-hasher";
import { JwtService } from "./utils/jwt-service/jwt-service";
import { SesMailer } from "./utils/mailer/ses-mailer";

export type Context = {
  readonly userRepository: UserRepository;
  readonly mailer: Mailer;
  readonly passwordHasher: PasswordHasher;
  readonly jwtService: JwtService;
};

export const createContext = (): Context => {
  const userRepository = new DrizzleUserRepository(db);
  const resendMailer = new SesMailer();
  const cryptoPasswordHasher = new CryptoPasswordHasher();
  const jwtService = new JwtService();
  return {
    userRepository,
    mailer: resendMailer,
    passwordHasher: cryptoPasswordHasher,
    jwtService,
  };
};
