import domainConfig from '@config/domain-config';
import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import ErrorCode from '@shared/error-codes';

import ValueObject from './core/value-object';

/**
 * Regras do código:
 * - Deve ter no mínimo 3 caracteres e no máximo 6
 * - Não devem possuir espaços
 * - Apenas letras, números, espaços e alguns caracteres especiais específicos (-, _, @, #, !, $, *)
 */
export default class Code extends ValueObject<string> {
  get value() {
    return this._rawValue;
  }

  protected override validate(value: string) {
    if (typeof value !== 'string') {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Code must be a string',
      );
    }

    if (!value) {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Code must not be empty',
      );
    }

    if (value.length < domainConfig.valueObjects.minCodeLength) {
      throw new InvalidValueObjectParseError(
        ErrorCode.CODE_TOO_SHORT,
        `Code must have at least ${domainConfig.valueObjects.minCodeLength} characters`,
      );
    }

    if (value.length > domainConfig.valueObjects.maxCodeLength) {
      throw new InvalidValueObjectParseError(
        ErrorCode.CODE_TOO_LONG,
        `Code must have at most ${domainConfig.valueObjects.maxCodeLength} characters`,
      );
    }

    const pattern = /^[a-zA-Z0-9-_@#*!$]*$/;
    if (!pattern.test(value)) {
      throw new InvalidValueObjectParseError(
        ErrorCode.CODE_INVALID_CHARACTERS,
        'Code must only contain letters, numbers and specific characters (-, _, @, #, !, $, *)',
      );
    }
  }
}
