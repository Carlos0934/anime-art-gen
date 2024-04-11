import { PasswordHasher } from "./interface";

import crypto from "crypto";

export class CryptoPasswordHasher implements PasswordHasher {
  hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex");
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(`${salt}:${key.toString("hex")}`);
      });
    });
  }

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashedPassword.split(":");
      crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(key === derivedKey.toString("hex"));
      });
    });
  }
}
