import ApplicationError from '@application/errors/application-error';
import ErrorCode from '@shared/error-codes';

namespace SignInError {
  export class InvalidPasswordError extends ApplicationError {
    constructor(message = 'Invalid password') {
      super(ErrorCode.INVALID_PASSWORD, message);
    }
  }
}

export default SignInError;
