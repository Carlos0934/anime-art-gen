export class Transaction {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;

  constructor({
    id,
    accountId,
    amount,
    createdAt,
  }: {
    id: string;
    accountId: string;
    amount: number;
    createdAt: string;
  }) {
    this.id = id;
    this.userId = accountId;
    this.amount = amount;
    this.createdAt = createdAt;
  }
}
