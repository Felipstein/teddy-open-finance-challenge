import CoreError from '@shared/core-error';
import ErrorCode from '@shared/error-codes';

export default class DomainError extends CoreError {
  constructor(
    readonly code: ErrorCode,
    message = 'An error occurred in the domain',
  ) {
    super(code, message);
  }
}
