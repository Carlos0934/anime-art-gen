import { AppModule } from "@/core/app-module";
import authRouter from "./routes/auth";
import { LoginUserHandler } from "./handlers/login-user";
import { ConfirmUserMailHandler } from "./handlers/confirm-user-mail";
import { RegisterAccountHandler } from "./handlers/register-account";
import { ResetUserPasswordHandler } from "./handlers/reset-user-password";
import { SendPasswordResetHandler } from "./handlers/send-password-reset";

export class AuthModule extends AppModule {
  constructor() {
    super({
      basePath: "/auth",
      handlers: [
        LoginUserHandler,
        ConfirmUserMailHandler,
        RegisterAccountHandler,
        ResetUserPasswordHandler,
        SendPasswordResetHandler,
      ],
      router: authRouter,
    });
  }
}
