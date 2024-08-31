import CoreError from './core-error';
import ErrorCode from './error-codes';

export type ValidationFieldError = {
  error: string;
  message: string;
  expected?: string;
  received?: string;
};

export default class ValidatorError extends CoreError {
  readonly issues: Record<string, ValidationFieldError>;

  constructor(parseErrorOutput: Record<string, ValidationFieldError>) {
    super(ErrorCode.INVALID_PARSE, 'Invalid parse');

    this.issues = parseErrorOutput;
  }
}
