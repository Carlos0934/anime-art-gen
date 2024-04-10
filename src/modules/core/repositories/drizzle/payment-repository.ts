import { payments } from "@/core/config/db/schema";
import { PaymentRepository } from "../payment-repository";
import database from "@/core/config/db/database";
import { eq } from "drizzle-orm";
import { Payment } from "@/core/entities/payment";

export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(private readonly db: typeof database) {}

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return (await this.db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))) as Payment[];
  }

  async save(payment: Payment): Promise<void> {
    await this.db
      .insert(payments)
      .values({
        amount: payment.amount,
        currency: payment.currency,
        userId: payment.userId,
        createdAt: payment.createdAt,
        id: payment.id,
        credits: payment.credits,
      })
      .execute();
  }
}
