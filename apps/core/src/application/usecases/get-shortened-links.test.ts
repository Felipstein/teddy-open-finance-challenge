import UserNotFoundError from '@application/errors/user-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import IUsersRepository from '@application/repositories/users-repository';
import dependenciesHub from '@dependencies-hub';

import createMock from '../../../tests/utils/create-mock';

import GetShortenedLinksUseCase from './get-shortened-links';

describe('GetShortenedLinks Use Case', () => {
  const shortenedLinksRepo: jest.Mocked<IShortenedLinksRepository> = createMock();
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  let getShortenedLinks: GetShortenedLinksUseCase;

  beforeEach(() => {
    dependenciesHub.registryMany(
      ['repositories.shortened-links', shortenedLinksRepo],
      ['repositories.users', usersRepo],
    );

    getShortenedLinks = new GetShortenedLinksUseCase();
  });

  it('deve retornar os links shortened sem erros', async () => {
    usersRepo.existsById = jest.fn().mockResolvedValue(true);
    shortenedLinksRepo.getAllByUserId = jest.fn().mockResolvedValue([]);

    await expect(getShortenedLinks.execute({ userId: 'mock-user-id' })).resolves.not.toThrow();
  });

  it('deve lançar uma exception caso o usuário não exista', async () => {
    usersRepo.existsById = jest.fn().mockResolvedValue(false);

    await expect(getShortenedLinks.execute({ userId: 'mock-user-id' })).rejects.toThrow(
      UserNotFoundError,
    );
  });
});
