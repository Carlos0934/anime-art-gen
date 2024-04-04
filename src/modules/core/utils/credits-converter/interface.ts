import { Exception, ExceptionType } from "@/core/exception";

export type Amount = {
  value: number;
  type: "USD";
};

const CREDITS_CONVERSION_RATE = 300; // 1 USD = 300 credits
export class CreditsConverter {
  convertToCredits(amount: Amount): number {
    if (amount.type !== "USD") {
      throw new Exception("Unsupported currency", ExceptionType.Forbidden);
    }

    return amount.value * CREDITS_CONVERSION_RATE;
  }
}
