import { Exception, ExceptionType } from "@/core/exception";

export class EmailNotVerifiedException extends Exception {
  constructor() {
    super("Email not verified", ExceptionType.Forbidden);
  }
}
