import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';

import Link from './link';

describe('Link Value Object', () => {
  it.each([
    'http://localhost:3333',
    'https://google.com',
    'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    'https://www.youtube.com/watch?v=Jp7XtQGd1k0&list=PLBbR4S0aZpVbK5pZn0v7q6w4bE0yv0d1T&index=3&t=0s',
    'https://subdomain.domain.net/with-path',
  ])('deve criar um link válido', (rawLink) => {
    const link = new Link(rawLink);

    expect(link.value).toBe(rawLink);
  });

  it.each([
    'aaaa',
    'https://',
    'https://google .com',
    'invalid://google.com',
    'http:/website.com.br',
  ])('deve lançar uma exception caso o link seja inválido', (invalidRawLink) => {
    expect(() => new Link(invalidRawLink)).toThrow(InvalidValueObjectParseError);
  });

  it.each([
    { rawLink: 'localhost:3333', expectedRawLink: 'https://localhost:3333' },
    { rawLink: 'www.google.com', expectedRawLink: 'https://www.google.com' },
    {
      rawLink: 'teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
      expectedRawLink:
        'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    },
    { rawLink: '//localhost:3333', expectedRawLink: 'https://localhost:3333' },
    { rawLink: '//www.google.com', expectedRawLink: 'https://www.google.com' },
    {
      rawLink:
        '//teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
      expectedRawLink:
        'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    },
    { rawLink: '://localhost:3333', expectedRawLink: 'https://localhost:3333' },
    { rawLink: '://www.google.com', expectedRawLink: 'https://www.google.com' },
    {
      rawLink:
        '://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
      expectedRawLink:
        'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    },
  ])('deve completar o link incompleto', ({ rawLink, expectedRawLink }) => {
    const link = new Link(rawLink);

    expect(link.value).toBe(expectedRawLink);
  });
});
