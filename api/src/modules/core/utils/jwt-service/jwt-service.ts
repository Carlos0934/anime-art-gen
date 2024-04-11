import jwt from "jsonwebtoken";

export class JwtService {
  sign(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  }

  verify<T>(token: string): T | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as T;
    } catch {
      return null;
    }
  }
}
