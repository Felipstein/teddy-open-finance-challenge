import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import ErrorCode from '@shared/error-codes';

import ValueObject from './core/value-object';

/**
 * Regras do link:
 * - Não devem possuir espaços no começo e no fim
 * - Deve ser um Link URL valido
 */
export default class Link extends ValueObject<string> {
  get value() {
    return this._rawValue;
  }

  protected override validate(value: string) {
    if (typeof value !== 'string') {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Link must be a string',
      );
    }

    if (!value) {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Link must not be empty',
      );
    }

    let transformedValue = value.trim();

    if (/^\/\/.+/.test(transformedValue)) {
      transformedValue = `https:${transformedValue}`;
    } else if (/^:\/\/.+/.test(transformedValue)) {
      transformedValue = `https${transformedValue}`;
    } else if (!transformedValue.startsWith('http')) {
      transformedValue = `https://${transformedValue}`;
    }

    const pattern = /^(https?:\/\/)((localhost:\d{1,5})|([\w.-]+\.[a-z]{2,}))(\/[^\s]*)?$/i;
    if (!pattern.test(transformedValue)) {
      throw new InvalidValueObjectParseError(ErrorCode.INVALID_LINK, 'Invalid link');
    }

    return transformedValue;
  }
}
