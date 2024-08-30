import ApplicationError from '@application/errors/application-error';
import ErrorCode from '@shared/error-codes';

namespace SignUpError {
  export class EmailAlreadyTakenError extends ApplicationError {
    constructor(message = 'Email already taken') {
      super(ErrorCode.EMAIL_ALREADY_TAKEN, message);
    }
  }
}

export default SignUpError;
