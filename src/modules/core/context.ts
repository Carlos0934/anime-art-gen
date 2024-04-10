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
import { PubNotificationService } from "./utils/pub-notification-service/interface";
import { SNSPubNotificationService } from "./utils/pub-notification-service/sns-pub-notification-service";
import { ImageGenerationRepository } from "./repositories/image-generation-repository";
import { DrizzleImageGenerationRepository } from "./repositories/drizzle/image-generation-repository";
import { KVStore } from "./utils/kv-store/interface";
import { DynamoDBKvStore } from "./utils/kv-store/dynamodb-kv-store";
import { FileService } from "./utils/file-service/interface";
import { S3FileService } from "./utils/file-service/s3-file-service";
import { PaymentRepository } from "./repositories/payment-repository";
import { DrizzlePaymentRepository } from "./repositories/drizzle/payment-repository";

export type Context = {
  readonly userRepository: UserRepository;
  readonly mailer: Mailer;
  readonly passwordHasher: PasswordHasher;
  readonly jwtService: JwtService;
  readonly creditsConverter: CreditsConverter;
  readonly pubNotificationService: PubNotificationService;
  readonly imageGeneratorClient: ImageGeneratorClient;
  readonly imageGenerationRepository: ImageGenerationRepository;
  readonly fileService: FileService;
  readonly tasksUsersKvStore: KVStore<{
    taskId: string;
    userId: string;
  }>;
  readonly paymentRepository: PaymentRepository;
};

export const createContext = (): Context => {
  const userRepository = new DrizzleUserRepository(db);
  const resendMailer = new SesMailer();
  const cryptoPasswordHasher = new CryptoPasswordHasher();
  const jwtService = new JwtService();
  const creditsConverter = new CreditsConverter();
  const imageGeneratorClient = new ReplicateImageGeneratorClient();
  const pubNotificationService = new SNSPubNotificationService();
  const imageGenerationRepository = new DrizzleImageGenerationRepository(db);
  const fileService = new S3FileService();
  const tasksUsersKvStore = new DynamoDBKvStore<{
    taskId: string;
    userId: string;
  }>("tasks_users");
  const paymentRepository = new DrizzlePaymentRepository(db);
  return {
    userRepository,
    mailer: resendMailer,
    passwordHasher: cryptoPasswordHasher,
    jwtService,
    creditsConverter,
    imageGeneratorClient,
    pubNotificationService: pubNotificationService,
    imageGenerationRepository,
    fileService,
    tasksUsersKvStore,
    paymentRepository,
  };
};
