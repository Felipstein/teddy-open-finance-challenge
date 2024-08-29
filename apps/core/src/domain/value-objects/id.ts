import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import isValidUUID from '@domain/services/is-valid-uuid';
import ErrorCode from '@shared/error-codes';

import ValueObject from './core/value-object';

export default class ID extends ValueObject<string> {
  get value() {
    return this._rawValue;
  }

  protected override validate(value: string) {
    if (!isValidUUID(value)) {
      throw new InvalidValueObjectParseError(ErrorCode.INVALID_ID, 'Invalid ID');
    }
  }
}
