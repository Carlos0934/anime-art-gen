import {
  PaymentCurrencies,
  SUPPORTED_CURRENCIES,
} from "@/core/entities/payment";
import { Exception, ExceptionType } from "@/core/exception";

export type Amount = {
  value: number;
  currency: string;
};

export const CREDITS_CONVERSION_RATE = 100; // 1 USD = 100 credits

export class CreditsConverter {
  convertToCredits(amount: Amount): number {
    const isSupportedCurrency = SUPPORTED_CURRENCIES.includes(amount.currency);

    if (!isSupportedCurrency) {
      throw new Exception("Unsupported currency", ExceptionType.Forbidden);
    }

    return amount.value * CREDITS_CONVERSION_RATE;
  }
}
