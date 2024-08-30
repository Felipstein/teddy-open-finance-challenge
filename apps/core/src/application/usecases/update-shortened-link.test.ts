import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import dependenciesHub from '@dependencies-hub';

import createMock from '../../../tests/utils/create-mock';
import generate from '../../../tests/utils/generate-random-entities';

import UpdateShortenedLinkUseCase from './update-shortened-link';

describe('UpdateShortenedLink Use Case', () => {
  const shortenedLinksRepo: jest.Mocked<IShortenedLinksRepository> = createMock();
  let updateShortenedLink: UpdateShortenedLinkUseCase;

  beforeEach(() => {
    dependenciesHub.registry('repositories.shortened-links', shortenedLinksRepo);

    updateShortenedLink = new UpdateShortenedLinkUseCase();
  });

  it('deve atualizar um ShortenedLink com sucesso', async () => {
    shortenedLinksRepo.getById = jest.fn().mockResolvedValue(generate.randomShortenedLink());
    shortenedLinksRepo.existsByCode = jest.fn().mockResolvedValue(false);
    shortenedLinksRepo.save = jest.fn();

    await expect(
      updateShortenedLink.execute({
        shortenedLinkId: 'mock-id',
        link: 'https://localhost:3000',
        customCode: 'custom',
      }),
    ).resolves.not.toThrow();
  });

  it('deve lançar uma exception caso o ShortenedLink não exista', async () => {
    shortenedLinksRepo.getById = jest.fn().mockResolvedValue(null);

    await expect(
      updateShortenedLink.execute({
        shortenedLinkId: 'mock-id',
        link: 'https://localhost:3000',
      }),
    ).rejects.toThrow(ShortenedLinkNotFoundError);
  });

  it('deve lançar uma exception o código customizado providenciado já existe', async () => {
    shortenedLinksRepo.getById = jest.fn().mockResolvedValue(generate.randomShortenedLink());
    shortenedLinksRepo.existsByCode = jest.fn().mockResolvedValue(true);

    await expect(
      updateShortenedLink.execute({
        shortenedLinkId: 'mock-id',
        customCode: 'custom',
      }),
    ).rejects.toThrow(CodeAlreadyTakenError);
  });
});
