import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import ErrorCode from '@shared/error-codes';

import ValueObject from './core/value-object';

export default class Email extends ValueObject<string> {
  get value() {
    return this._rawValue;
  }

  protected override validate(value: string) {
    if (typeof value !== 'string') {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'E-mail must be a string',
      );
    }

    if (!value) {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'E-mail must not be empty',
      );
    }

    const pattern = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
    if (!pattern.test(value)) {
      throw new InvalidValueObjectParseError(ErrorCode.INVALID_EMAIL, 'Invalid e-mail');
    }

    return value.trim();
  }
}
