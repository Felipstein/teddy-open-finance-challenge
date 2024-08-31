import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class ExpiredTokenError extends ApplicationError {
  constructor(message = 'Expired token') {
    super(ErrorCode.EXPIRED_TOKEN, message);
  }
}
