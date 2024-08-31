import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class InvalidTokenError extends ApplicationError {
  constructor(message = 'Invalid token') {
    super(ErrorCode.INVALID_TOKEN, message);
  }
}
