export class User {
  id: string;
  email: string;
  password: string | null;
  credits: number;
  createdAt: Date;
  emailVerified: Date | null;

  constructor({
    id,
    email,
    credits,
    createdAt,
    emailVerified,
    password,
  }: {
    id: string;
    email: string;
    password: string | null;
    credits: number;
    createdAt: string | Date | number;
    emailVerified: string | Date | number | null;
  }) {
    this.id = id;
    this.email = email;
    this.credits = credits;
    this.password = password;
    this.createdAt = new Date(createdAt);
    this.emailVerified = emailVerified ? new Date(emailVerified) : null;
  }
}
