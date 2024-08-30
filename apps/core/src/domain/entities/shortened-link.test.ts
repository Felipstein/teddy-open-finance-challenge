import DomainError from '@domain/errors/domain-error';
import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import { delay } from '../../../tests/utils/delay';

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

  it.each([
    (shortenedLink: ShortenedLink) => {
      shortenedLink.code = 'abcDf';
    },
    (shortenedLink: ShortenedLink) => {
      shortenedLink.link = 'http://localhost:3333/new-link';
    },
    (shortenedLink: ShortenedLink) => {
      shortenedLink.expiresIn = null;
    },
  ])('deve atualizar o campo updatedAt após sofrer uma mutação', async (updateShortenedLink) => {
    const shortenedLink = ShortenedLink.create({
      link: 'http://localhost:3333/original-link',
      expiresIn: new Date(),
    });

    expect(shortenedLink.updatedAt).toEqual(shortenedLink.createdAt);

    await delay();
    updateShortenedLink(shortenedLink);

    expect(shortenedLink.updatedAt).not.toEqual(shortenedLink.createdAt);
    expect(shortenedLink.updatedAt.getTime()).toBeGreaterThan(shortenedLink.createdAt.getTime());
  });

  it('deve lançar uma exception quando for criado um ShortenedLink com código inválido', () => {
    expect(() =>
      ShortenedLink.create({
        link: 'http://localhost:3333/original-link',
        customCode: 'moiJWThgtrn',
      }),
    ).toThrow(InvalidValueObjectParseError);
  });

  it('deve lançar uma exception quando for tentar usar um ShortenedLink expirado', () => {
    const shortenedLink = ShortenedLink.create({
      link: 'http://localhost:3333/original-link',
      expiresIn: new Date(0),
    });

    expect(() => shortenedLink.incrementUsageCount()).toThrow(DomainError);
  });
});
