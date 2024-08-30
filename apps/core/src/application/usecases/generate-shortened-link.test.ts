import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import UserNotFoundError from '@application/errors/user-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import IUsersRepository from '@application/repositories/users-repository';
import dependenciesHub from '@dependencies-hub';

import createMock from '../../../tests/utils/create-mock';

import GenerateShortenedLinkUseCase from './generate-shortened-link';

describe('GenerateShortenedLink Use Case', () => {
  const shortenedLinksRepo: jest.Mocked<IShortenedLinksRepository> = createMock();
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  let generateShortenedLink: GenerateShortenedLinkUseCase;

  beforeEach(() => {
    dependenciesHub.registryMany(
      ['repositories.shortened-links', shortenedLinksRepo],
      ['repositories.users', usersRepo],
    );

    generateShortenedLink = new GenerateShortenedLinkUseCase();
  });

  it('deve gerar um encurtamento de link', async () => {
    shortenedLinksRepo.save = jest.fn();

    const { code } = await generateShortenedLink.execute({ link: 'https://localhost:3333.com' });

    expect(code).toBeDefined();
  });

  it('deve gerar um encurtamento de link com código customizado', async () => {
    shortenedLinksRepo.existsByCode = jest.fn().mockResolvedValue(false);
    shortenedLinksRepo.save = jest.fn();

    const customCode = 'custom';

    const { code } = await generateShortenedLink.execute({
      link: 'https://localhost:3333.com',
      customCode,
    });

    expect(code).toBe(customCode);
  });

  it('deve lançar uma exception caso o código customizado já existe', async () => {
    shortenedLinksRepo.existsByCode = jest.fn().mockResolvedValue(true);

    await expect(() =>
      generateShortenedLink.execute({
        link: 'https://localhost:3333.com',
        customCode: 'custom',
      }),
    ).rejects.toThrow(CodeAlreadyTakenError);
  });

  it('deve lançar uma exception caso o usuário responsável não exista', async () => {
    usersRepo.existsById = jest.fn().mockResolvedValue(false);

    await expect(() =>
      generateShortenedLink.execute({
        link: 'https://localhost:3333.com',
        createdByUserId: 'mock-user-id',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
