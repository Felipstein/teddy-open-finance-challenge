import ErrorCode from '@shared/error-codes';

import ApplicationError from './application-error';

export default class ShortenedLinkNotFoundError extends ApplicationError {
  constructor(message = 'Shortened link not found') {
    super(ErrorCode.SHORTENED_LINK_NOT_FOUND, message);
  }
}
