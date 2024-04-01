import crypto from "crypto";

export function compareHash(password: string, hash: string): boolean {
  const [salt, key] = hash.split(":");

  const compare = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return key === compare;
}
