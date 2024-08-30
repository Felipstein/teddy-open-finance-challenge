import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class UserNotFoundError extends ApplicationError {
  constructor(message = 'User not found') {
    super(ErrorCode.USER_NOT_FOUND, message);
  }
}
