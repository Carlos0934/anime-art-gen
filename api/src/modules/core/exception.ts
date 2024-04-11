export enum ExceptionType {
  Conflict,
  Unauthorized,
  NotFound,
  BadArgument,
  Forbidden,
}
export class Exception extends Error {
  constructor(readonly message: string, public readonly type: ExceptionType) {
    super(message);
  }
}
