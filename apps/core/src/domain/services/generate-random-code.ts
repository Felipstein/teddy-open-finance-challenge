import domainConfig from '@config/domain-config';
import DomainError from '@domain/errors/domain-error';
import Code from '@domain/value-objects/code';
import ErrorCode from '@shared/error-codes';
import numberUtils from '@shared/utils/number-utils';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_@#!$*';

const randomLength = () =>
  numberUtils.random(
    domainConfig.valueObjects.minCodeLength,
    domainConfig.valueObjects.maxCodeLength,
  );

export default function generateRandomCode(length = randomLength()) {
  if (length > domainConfig.valueObjects.maxCodeLength) {
    throw new DomainError(
      ErrorCode.CODE_TOO_LONG,
      `Code must have at most ${domainConfig.valueObjects.maxCodeLength} characters`,
    );
  }

  if (length < domainConfig.valueObjects.minCodeLength) {
    throw new DomainError(
      ErrorCode.CODE_TOO_SHORT,
      `Code must have at least ${domainConfig.valueObjects.maxCodeLength} characters`,
    );
  }

  let code = '';

  for (let i = 0; i < length; i++) {
    code += CHARS[numberUtils.random(CHARS.length - 1)];
  }

  return new Code(code);
}
