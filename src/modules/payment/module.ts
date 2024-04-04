import { AppModule } from "../core/app-module";
import { RechargeCreditsHandler } from "./handlers/recharge-credits-handler";
import paymentRoutes from "./routes";

export class PaymentModule extends AppModule {
  constructor() {
    super({
      basePath: "/payment",
      handlers: [RechargeCreditsHandler],
      routes: paymentRoutes,
    });
  }
}
