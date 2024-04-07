import db from "./config/db/database";
import { Mailer } from "./utils/mailer/interface";
import { DrizzleUserRepository } from "./repositories/drizzle/user-repository";
import { UserRepository } from "./repositories/user-repository";
import { PasswordHasher } from "./utils/password-hasher/interface";
import { CryptoPasswordHasher } from "./utils/password-hasher/crypto-password-hasher";
import { JwtService } from "./utils/jwt-service/jwt-service";
import { SesMailer } from "./utils/mailer/ses-mailer";
import { CreditsConverter } from "./utils/credits-converter/converter";
import { ImageGeneratorClient } from "./utils/image-generator-client/interface";
import { ReplicateImageGeneratorClient } from "./utils/image-generator-client/replicate-image-generator-client";
import { QueueService } from "./utils/queue-service/interface";
import { SQSQueueService } from "./utils/queue-service/sqs-queue-service";

export type Context = {
  readonly userRepository: UserRepository;
  readonly mailer: Mailer;
  readonly passwordHasher: PasswordHasher;
  readonly jwtService: JwtService;
  readonly creditsConverter: CreditsConverter;
  readonly queueService: QueueService;
  readonly imageGeneratorClient: ImageGeneratorClient;
};

export const createContext = (): Context => {
  const userRepository = new DrizzleUserRepository(db);
  const resendMailer = new SesMailer();
  const cryptoPasswordHasher = new CryptoPasswordHasher();
  const jwtService = new JwtService();
  const creditsConverter = new CreditsConverter();
  const queueService = new SQSQueueService();
  const imageGeneratorClient = new ReplicateImageGeneratorClient();

  return {
    userRepository,
    mailer: resendMailer,
    passwordHasher: cryptoPasswordHasher,
    jwtService,
    creditsConverter,
    imageGeneratorClient,
    queueService,
  };
};
