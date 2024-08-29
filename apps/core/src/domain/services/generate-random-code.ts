import domainConfig from '@config/domain-config';
import Code from '@domain/value-objects/code';
import numberUtils from '@shared/utils/number-utils';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_@#!$*';

const randomLength = () =>
  numberUtils.random(
    domainConfig.valueObjects.minCodeLength,
    domainConfig.valueObjects.maxCodeLength,
  );

export default function generateRandomCode(length = randomLength()) {
  let code = '';

  for (let i = 0; i < length; i++) {
    code += CHARS[numberUtils.random(CHARS.length - 1)];
  }

  return new Code(code);
}
