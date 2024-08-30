import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class CodeAlreadyTakenError extends ApplicationError {
  constructor(message = 'Code already taken') {
    super(ErrorCode.CODE_ALREADY_TAKEN, message);
  }
}
