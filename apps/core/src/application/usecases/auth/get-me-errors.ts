import ApplicationError from '@application/errors/application-error';
import ErrorCode from '@shared/error-codes';

namespace GetMeError {
  export class InvalidTokenError extends ApplicationError {
    constructor(type: 'expired' | 'invalid', message = 'Invalid token') {
      super(type === 'expired' ? ErrorCode.EXPIRED_TOKEN : ErrorCode.INVALID_TOKEN, message);
    }
  }
}

export default GetMeError;
