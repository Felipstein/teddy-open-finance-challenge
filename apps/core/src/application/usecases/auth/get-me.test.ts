import UserNotFoundError from '@application/errors/user-not-found-error';
import IUsersRepository from '@application/repositories/users-repository';
import ITokenService from '@application/services/token-service';
import dependenciesHub from '@dependencies-hub';
import Email from '@domain/value-objects/email';
import Name from '@domain/value-objects/name';

import createMock from '../../../../tests/utils/create-mock';
import generate from '../../../../tests/utils/generate-random-entities';

import GetMeUseCase from './get-me';
import GetMeError from './get-me-errors';

describe('GetMe Use Case', () => {
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  const tokenService: jest.Mocked<ITokenService> = createMock();
  let getMe: GetMeUseCase;

  beforeEach(() => {
    dependenciesHub.registryMany(
      ['repositories.users', usersRepo],
      ['services.token', tokenService],
    );

    getMe = new GetMeUseCase();
  });

  it('deve retornar informações básicas do usuário', async () => {
    usersRepo.getById = jest.fn().mockResolvedValue(
      generate.randomUser({
        name: new Name('John Doe'),
        email: new Email('johndoe@example.com'),
      }),
    );
    tokenService.verifySafe = jest
      .fn()
      .mockResolvedValue({ status: 'valid', payload: { sub: 'mock-user-id' } });

    const user = await getMe.execute({ accessToken: 'mock-access-token' });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('deve lançar uma exception caso o token seja inválido', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({ status: 'invalid', payload: null });

    await expect(() => getMe.execute({ accessToken: 'mock-access-token' })).rejects.toThrow(
      GetMeError.InvalidTokenError,
    );
  });

  it('deve lançar uma exception caso o token esteja com o payload corrompido', async () => {
    tokenService.verifySafe = jest
      .fn()
      .mockResolvedValue({ status: 'valid', payload: { sub: 123 } });

    await expect(() => getMe.execute({ accessToken: 'mock-access-token' })).rejects.toThrow(
      GetMeError.InvalidTokenError,
    );
  });

  it('deve lançar uma exception caso o usuário do token não exista', async () => {
    tokenService.verifySafe = jest
      .fn()
      .mockResolvedValue({ status: 'valid', payload: { sub: 'mock-user-id' } });
    usersRepo.getById = jest.fn().mockResolvedValue(null);

    await expect(() => getMe.execute({ accessToken: 'mock-access-token' })).rejects.toThrow(
      UserNotFoundError,
    );
  });
});
