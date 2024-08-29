import ErrorCode, { errorCodeToString } from './error-codes';

export default class CoreError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);

    this.name = `${this.name} [${this.errorCodeToString()}]`;
  }

  errorCodeToString() {
    return errorCodeToString(this.code);
  }

  get rawName() {
    return this.constructor.name;
  }
}
