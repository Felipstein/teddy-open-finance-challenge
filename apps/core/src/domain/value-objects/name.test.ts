import domainConfig from '@config/domain-config';
import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import Name from './name';

describe('Name Value Object', () => {
  it('deve validar corretamente o nome', () => {
    const name = new Name('John Doe');

    expect(name.value).toBe('John Doe');
  });

  it('deve limpar espaços iniciais, finais e duplicados do nome', () => {
    const name = new Name(' John  Doe ');

    expect(name.value).toBe('John Doe');
  });

  it('deve lançar uma exception caso o nome possua caracteres inválido', () => {
    expect(() => new Name('J@hn Doe')).toThrow(InvalidValueObjectParseError);
  });

  it(`deve lançar uma exception caso o nome ultrapasse o limite de ${domainConfig.valueObjects.maxNameLength} caracteres`, () => {
    expect(() => new Name('a'.repeat(domainConfig.valueObjects.maxNameLength + 1))).toThrow(
      InvalidValueObjectParseError,
    );
  });

  it(`deve lançar uma exception caso o nome possua menos de ${domainConfig.valueObjects.minNameLength} caracteres`, () => {
    expect(() => new Name('a'.repeat(domainConfig.valueObjects.minNameLength - 1))).toThrow(
      InvalidValueObjectParseError,
    );
  });

  it(`deve lançar uma exception caso o nome esteja vazio`, () => {
    expect(() => new Name('')).toThrow(InvalidValueObjectParseError);
  });
});
