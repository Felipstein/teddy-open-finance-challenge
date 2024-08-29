import domainConfig from '@config/domain-config';
import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import Code from './code';

describe('Code Value Object', () => {
  it.each(['aTHrn', '1234', '_inv#a'])('deve validar corretamente o código', (rawCode) => {
    const code = new Code(rawCode);

    expect(code.value).toEqual(rawCode);
  });

  it('deve lançar uma exception caso o código esteja vazio', () => {
    expect(() => new Code('')).toThrow(InvalidValueObjectParseError);
  });

  it(`deve lançar uma exception caso o código seja menor que ${domainConfig.valueObjects.minCodeLength} caracteres`, () => {
    expect(() => new Code('a'.repeat(domainConfig.valueObjects.minCodeLength - 1))).toThrow(
      InvalidValueObjectParseError,
    );
  });

  it(`deve lançar uma exception caso o código seja maior que ${domainConfig.valueObjects.maxCodeLength} caracteres`, () => {
    expect(() => new Code('a'.repeat(domainConfig.valueObjects.maxCodeLength + 1))).toThrow(
      InvalidValueObjectParseError,
    );
  });

  it.each(['abc&', 'def?', 'fgt='])(
    `deve lançar uma exception caso o código possua caracteres inválidos`,
    (rawCode) => {
      expect(() => new Code(rawCode)).toThrow(InvalidValueObjectParseError);
    },
  );
});
