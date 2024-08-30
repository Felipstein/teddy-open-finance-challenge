import ApplicationError from '@application/errors/application-error';
import ErrorCode from '@shared/error-codes';

namespace GenerateShortenedLinkError {
  export class CodeAlreadyTaken extends ApplicationError {
    constructor(message = 'Code already taken') {
      super(ErrorCode.CODE_ALREADY_TAKEN, message);
    }
  }
}

export default GenerateShortenedLinkError;
