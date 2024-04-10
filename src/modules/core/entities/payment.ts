export enum PaymentCurrencies {
  USD = "USD",
  EUR = "EUR",
}

export const SUPPORTED_CURRENCIES = Object.values(
  PaymentCurrencies
) as readonly string[];

export class Payment {
  public readonly id: string;
  public readonly userId: string;
  public readonly amount: number;
  public readonly currency: PaymentCurrencies;
  public readonly credits: number;
  public readonly createdAt: Date;
  constructor({
    id,
    userId,
    amount,
    currency,
    credits,
    createdAt,
  }: {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    credits: number;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.createdAt = createdAt;
    this.credits = credits;

    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      throw new Error(`Invalid currency ${currency}`);
    }

    this.currency = currency as PaymentCurrencies;
  }
}
