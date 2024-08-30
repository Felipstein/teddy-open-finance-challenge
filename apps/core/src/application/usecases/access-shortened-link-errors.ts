import ApplicationError from '@application/errors/application-error';
import ErrorCode from '@shared/error-codes';

namespace AccessShortenedLinkError {
  export class ExpiredShortenedLinkError extends ApplicationError {
    constructor(message = 'Expired shortened link') {
      super(ErrorCode.EXPIRED_SHORTENED_LINK, message);
    }
  }
}

export default AccessShortenedLinkError;
