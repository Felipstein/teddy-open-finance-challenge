import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import dependenciesHub from '@dependencies-hub';

import createMock from '../../../tests/utils/create-mock';

import DeleteShortenedLinkUseCase from './delete-shortened-link';

describe('DeleteShortenedLink Use Case', () => {
  const shortenedLinksRepo: jest.Mocked<IShortenedLinksRepository> = createMock();
  let deleteShortenedLink: DeleteShortenedLinkUseCase;

  beforeEach(() => {
    dependenciesHub.registry('repositories.shortened-links', shortenedLinksRepo);

    deleteShortenedLink = new DeleteShortenedLinkUseCase();
  });

  it('deve deletar um ShortenedLink com sucesso', async () => {
    shortenedLinksRepo.existsById = jest.fn().mockResolvedValue(true);
    shortenedLinksRepo.delete = jest.fn();

    await deleteShortenedLink.execute({ shortenedLinkId: 'mock-id' });

    expect(shortenedLinksRepo.delete).toHaveBeenCalledWith('mock-id');
  });
});
