import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import dependenciesHub from '@dependencies-hub';
import Code from '@domain/value-objects/code';

import createMock from '../../../tests/utils/create-mock';
import generate from '../../../tests/utils/generate-random-entities';

import AccessShortenedLinkUseCase from './access-shortened-link';
import AccessShortenedLinkError from './access-shortened-link-errors';

describe('AccessShortenedLink Use Case', () => {
  const shortenedLinksRepo: jest.Mocked<IShortenedLinksRepository> = createMock();
  let accessShortenedLink: AccessShortenedLinkUseCase;

  beforeEach(() => {
    dependenciesHub.registry('repositories.shortened-links', shortenedLinksRepo);

    accessShortenedLink = new AccessShortenedLinkUseCase();
  });

  it('deve acessar um ShortenedLink com sucesso e incrementar o total de acessos', async () => {
    const shortenedLink = generate.randomShortenedLink({
      code: new Code('aZbKq7'),
      link: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
      usageCount: 6,
    });

    shortenedLinksRepo.getByCode = jest.fn().mockResolvedValue(shortenedLink);
    shortenedLinksRepo.save = jest.fn();

    const { linkToRedirect } = await accessShortenedLink.execute({ code: 'aZbKq7' });

    expect(linkToRedirect).toBe(
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    );
    expect(shortenedLink.usageCount).toBe(7);
  });

  it('deve lançar uma exception caso o ShortenedLink não exista', async () => {
    shortenedLinksRepo.getByCode = jest.fn().mockResolvedValue(null);

    await expect(accessShortenedLink.execute({ code: 'custom' })).rejects.toThrow(
      ShortenedLinkNotFoundError,
    );
  });

  it('deve lançar uma exception caso o ShortenedLink esteja expirado', async () => {
    shortenedLinksRepo.getByCode = jest.fn().mockResolvedValue(
      generate.randomShortenedLink({
        expiresIn: new Date(0),
      }),
    );

    await expect(accessShortenedLink.execute({ code: 'custom' })).rejects.toThrow(
      AccessShortenedLinkError.ExpiredShortenedLinkError,
    );
  });
});
