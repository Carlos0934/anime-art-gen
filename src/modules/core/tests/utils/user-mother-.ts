import { User } from "../../entities/user";

export class UserBuilder {
  private id: string;
  private email: string;
  private password: string | null;
  private createdAt: Date;
  private credits: number;
  private emailVerified: Date | null;

  constructor() {
    this.id = "user123";
    this.email = "test@example.com";
    this.password = "password123";
    this.createdAt = new Date();
    this.credits = 0;
    this.emailVerified = null;
  }

  withId(id: string): UserBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  withCreatedAt(createdAt: Date): UserBuilder {
    this.createdAt = createdAt;
    return this;
  }

  withCredits(credits: number): UserBuilder {
    this.credits = credits;
    return this;
  }

  withEmailVerified(emailVerified: Date | null): UserBuilder {
    this.emailVerified = emailVerified;
    return this;
  }

  build(): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      credits: this.credits,
      emailVerified: this.emailVerified,
    });
  }
}

export class UserMother {
  static createDefaultUser(): User {
    return new UserBuilder().build();
  }

  static createVerifiedUser(): User {
    return new UserBuilder().withEmailVerified(new Date()).build();
  }
}
