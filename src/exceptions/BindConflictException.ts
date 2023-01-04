export class BindConflictException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BindConflictException.prototype);
  }
}
