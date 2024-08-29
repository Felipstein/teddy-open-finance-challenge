import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import Email from './email';

describe('E-mail Value Object', () => {
  it.each([
    'johndoe@example.com',
    'johndoe@example.com.br',
    'john-doe@example.com',
    'john_doe@example.com',
    'john.doe@example.com',
    'johndoe@example.br',
  ])('deve validar corretamente os exemplos de e-mail', (rawEmail) => {
    const email = new Email(rawEmail);

    expect(email.value).toBe(rawEmail);
  });

  it('deve limpar os espaços iniciais e finais do e-mail', () => {
    const email = new Email(' johndoe@example.com ');

    expect(email.value).toBe('johndoe@example.com');
  });

  it('deve lançar uma exception caso o e-mail esteja vazio', () => {
    expect(() => new Email('')).toThrow(InvalidValueObjectParseError);
  });

  it('deve lançar uma exception caso o e-mail esteja inválido', () => {
    expect(() => new Email('invalidemail')).toThrow(InvalidValueObjectParseError);
  });
});
