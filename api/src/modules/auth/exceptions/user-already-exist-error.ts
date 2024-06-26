import { Exception, ExceptionType } from "../../core/exception";

export class UserAlreadyExistException extends Exception {
  constructor(email: string) {
    super(`User with email ${email} already exist`, ExceptionType.Conflict);
  }
}
