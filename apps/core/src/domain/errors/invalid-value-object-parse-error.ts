import ErrorCode from '@shared/error-codes';

import DomainError from './domain-error';

export default class InvalidValueObjectParseError extends DomainError {
  constructor(code = ErrorCode.INVALID_VALUE_OBJECT_PARSE, message = 'Invalid value object parse') {
    super(code, message);
  }
}
