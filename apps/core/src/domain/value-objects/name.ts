import domainConfig from '@config/domain-config';
import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import ErrorCode from '@shared/error-codes';

import ValueObject from './core/value-object';

/**
 * Regras do nome:
 * - Não devem possuir espaços no começo e no fim
 * - Não devem possuir espaços repetidos
 * - Deve ter no mínimo 3 caracteres e no máximo 50
 * - Apenas letras, números, espaços e alguns caracteres especiais específicos (-, _)
 */
export default class Name extends ValueObject<string> {
  get value() {
    return this._rawValue;
  }

  protected override validate(value: string) {
    if (typeof value !== 'string') {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Name must be a string',
      );
    }

    if (!value) {
      throw new InvalidValueObjectParseError(
        ErrorCode.INVALID_VALUE_OBJECT_PARSE,
        'Name must not be empty',
      );
    }

    if (value.length < domainConfig.valueObjects.minNameLength) {
      throw new InvalidValueObjectParseError(
        ErrorCode.NAME_TOO_SHORT,
        `Name must have at least ${domainConfig.valueObjects.minNameLength} characters`,
      );
    }

    if (value.length > domainConfig.valueObjects.maxNameLength) {
      throw new InvalidValueObjectParseError(
        ErrorCode.NAME_TOO_LONG,
        `Name must have at most ${domainConfig.valueObjects.maxNameLength} characters`,
      );
    }

    const pattern = /^[a-zA-Z0-9-_'. ]*$/;
    if (!pattern.test(value)) {
      throw new InvalidValueObjectParseError(
        ErrorCode.NAME_INVALID_CHARACTERS,
        'Name must only contain letters, numbers, dashes and underscores',
      );
    }

    return removeRepeatedSpaces(value);
  }
}

function removeRepeatedSpaces(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}
