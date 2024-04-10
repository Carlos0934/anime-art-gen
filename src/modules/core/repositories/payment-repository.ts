import { Payment } from "../entities/payment";

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
}
