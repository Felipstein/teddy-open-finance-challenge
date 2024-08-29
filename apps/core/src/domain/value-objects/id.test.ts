import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import ID from './id';

describe('ID Value Object', () => {
  it('deve validar corretamente o ID', () => {
    const id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    expect(() => new ID(id)).not.toThrow();

    const valueObject = new ID(id);
    expect(valueObject.value).toEqual(id);
  });

  it('deve lançar um erro quando o ID providenciado é inválido', () => {
    const id = 'a0eebcdd99-923c0b-4ef8-bb-6bb9bd381';
    expect(() => new ID(id)).toThrow(InvalidValueObjectParseError);
  });
});
