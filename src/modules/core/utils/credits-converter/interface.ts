import { Exception, ExceptionType } from "@/core/exception";

export type Amount = {
  value: number;
  type: string;
};

export const CREDITS_CONVERSION_RATE = 300; // 1 USD = 300 credits
export const SUPPORTED_CURRENCIES = ["USD"];
export class CreditsConverter {
  convertToCredits(amount: Amount): number {
    const isSupportedCurrency = SUPPORTED_CURRENCIES.includes(amount.type);

    if (!isSupportedCurrency) {
      throw new Exception("Unsupported currency", ExceptionType.Forbidden);
    }

    return amount.value * CREDITS_CONVERSION_RATE;
  }
}
