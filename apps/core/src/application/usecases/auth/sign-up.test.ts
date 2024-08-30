import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import dependenciesHub from '@dependencies-hub';
import env from '@env';

import createMock from '../../../../tests/utils/create-mock';

import SignUpUseCase from './sign-up';
import SignUpError from './sign-up-errors';

describe('SignUp Use Case', () => {
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  const cryptService: jest.Mocked<ICryptService> = createMock();
  const tokenService: jest.Mocked<ITokenService> = createMock();
  let signUp: SignUpUseCase;

  beforeEach(() => {
    dependenciesHub.registryMany(
      ['repositories.users', usersRepo],
      ['services.crypt', cryptService],
      ['services.token', tokenService],
    );

    signUp = new SignUpUseCase();
  });

  it('deve cadastrar um novo usuário', async () => {
    usersRepo.existsByEmail = jest.fn().mockResolvedValue(false);
    usersRepo.save = jest.fn();
    cryptService.hash = jest.fn().mockResolvedValue('hashed-password');
    tokenService.sign = jest.fn().mockResolvedValue('mock-access-token');

    const output = await signUp.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    expect(output.userId).toBeDefined();
    expect(output.accessToken).toBe('mock-access-token');
    expect(usersRepo.existsByEmail).toHaveBeenCalledWith('johndoe@example.com');
    expect(cryptService.hash).toHaveBeenCalledWith('123123123', expect.any(Number));
    expect(tokenService.sign).toHaveBeenCalledWith(
      { sub: expect.any(String) },
      env().ACCESS_TOKEN_SECRET_KEY,
      env().ACCESS_TOKEN_EXPIRES_IN,
    );
  });

  it('deve lançar uma exception quando criar um usuário com e-mail já existente', async () => {
    usersRepo.existsByEmail = jest.fn().mockResolvedValue(true);

    await expect(() =>
      signUp.execute({ name: 'John Doe', email: 'johndoe@example.com', password: '123123123' }),
    ).rejects.toThrow(SignUpError.EmailAlreadyTakenError);
  });
});
