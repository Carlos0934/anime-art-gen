import { AppModule } from "@/core/app-module";
import authRoutes from "./routes";
import { LoginUserHandler } from "./handlers/login-user";
import { ConfirmUserMailHandler } from "./handlers/confirm-user-mail";
import { RegisterUserHandler } from "./handlers/register-user";
import { ResetUserPasswordHandler } from "./handlers/reset-user-password";
import { SendPasswordResetHandler } from "./handlers/send-password-reset";

export class AuthModule extends AppModule {
  constructor() {
    super({
      basePath: "/auth",
      handlers: [
        LoginUserHandler,
        ConfirmUserMailHandler,
        RegisterUserHandler,
        ResetUserPasswordHandler,
        SendPasswordResetHandler,
      ],
      routes: authRoutes,
    });
  }
}
