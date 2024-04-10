import { AppModule } from "../core/app-module";
import { GetPaymentHistoryHandler } from "./handlers/get-payment-history";
import { RechargeCreditsHandler } from "./handlers/recharge-credits-handler";
import paymentRoutes from "./routes";

export class PaymentModule extends AppModule {
  constructor() {
    super({
      basePath: "/payment",
      handlers: [RechargeCreditsHandler, GetPaymentHistoryHandler],
      routes: paymentRoutes,
    });
  }
}
