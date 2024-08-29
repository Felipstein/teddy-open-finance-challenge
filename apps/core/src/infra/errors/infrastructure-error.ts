import CoreError from '@shared/core-error';
import ErrorCode from '@shared/error-codes';

export default class InfrastructureError extends CoreError {
  constructor(
    readonly code: ErrorCode,
    message = 'An error occurred in the infrastructure',
  ) {
    super(code, message);
  }
}
