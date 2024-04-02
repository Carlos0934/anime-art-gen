import { Exception, ExceptionType } from "../../core/exception";

export class InvalidCredentialsException extends Exception {
  constructor() {
    super("Invalid credentials", ExceptionType.Unauthorized);
  }
}
