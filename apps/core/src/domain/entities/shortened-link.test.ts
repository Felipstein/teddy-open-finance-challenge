import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import ShortenedLink from './shortened-link';

describe('ShortenedLink Entity', () => {
  it('deve criar um ShortenedLink válido', () => {
    const shortenedLink = ShortenedLink.create({
      link: 'http://localhost:3333/original-link',
    });

    expect(shortenedLink.link).toBe('http://localhost:3333/original-link');
    expect(shortenedLink.code).toBeDefined();
  });

  it('deve criar um ShortenedLink com código customizado', () => {
    const shortenedLink = ShortenedLink.create({
      link: 'http://localhost:3333/original-link',
      customCode: 'mycode',
    });

    expect(shortenedLink.link).toBe('http://localhost:3333/original-link');
    expect(shortenedLink.code).toBe('mycode');
  });

  it('deve lançar uma exception quando for criado um ShortenedLink com código inválido', () => {
    expect(() =>
      ShortenedLink.create({
        link: 'http://localhost:3333/original-link',
        customCode: 'moiJWThgtrn',
      }),
    ).toThrow(InvalidValueObjectParseError);
  });
});
