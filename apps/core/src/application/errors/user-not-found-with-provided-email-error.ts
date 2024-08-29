import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class UserNotFoundWithProvidedEmailError extends ApplicationError {
  constructor(message = 'User not found by provided  e-mail') {
    super(ErrorCode.USER_NOT_FOUND_BY_EMAIL, message);
  }
}
