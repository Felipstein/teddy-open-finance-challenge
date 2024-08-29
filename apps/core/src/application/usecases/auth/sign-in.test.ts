import UserNotFoundWithProvidedEmailError from '@application/errors/user-not-found-with-provided-email-error';
import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import generateRandomID from '@domain/services/generate-random-id';
import env from '@env';

import createMock from '../../../../tests-utils/create-mock';
import generate from '../../../../tests-utils/generate-random-entities';

import SignInUseCase from './sign-in';
import SignInError from './sign-in.errors';

describe('SignIn Use Case', () => {
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  const cryptService: jest.Mocked<ICryptService> = createMock();
  const tokenService: jest.Mocked<ITokenService> = createMock();
  let signIn: SignInUseCase;

  beforeEach(() => {
    signIn = new SignInUseCase(usersRepo, cryptService, tokenService);
  });

  it('deve realizar o login com sucesso', async () => {
    const userId = generateRandomID().value;
    const user = generate.randomUser({ id: userId });

    usersRepo.getByEmail = jest.fn().mockResolvedValue(user);
    cryptService.compare = jest.fn().mockResolvedValue(true);
    tokenService.sign = jest.fn().mockResolvedValue('mock-access-token');

    const output = await signIn.execute({
      email: 'johndoe@example.com',
      password: '123123123',
    });

    expect(output.userId).toBe(userId);
    expect(output.accessToken).toBe('mock-access-token');

    expect(cryptService.compare).toHaveBeenCalledWith('123123123', user.hashedPassword);

    expect(tokenService.sign).toHaveBeenCalledWith(
      { sub: userId },
      env().ACCESS_TOKEN_SECRET_KEY,
      env().ACCESS_TOKEN_EXPIRES_IN,
    );
  });

  it('deve lançar uma exception caso o usuário não for encontrado com o e-mail providenciado', async () => {
    usersRepo.getByEmail = jest.fn().mockResolvedValue(null);

    await expect(() =>
      signIn.execute({ email: 'johndoe@example.com', password: '123123123' }),
    ).rejects.toThrow(UserNotFoundWithProvidedEmailError);
  });

  it('deve lançar uma exception caso a senha providenciada esteja incorreta', async () => {
    usersRepo.getByEmail = jest.fn().mockResolvedValue(generate.randomUser());
    cryptService.compare = jest.fn().mockResolvedValue(false);

    await expect(() =>
      signIn.execute({ email: 'johndoe@example.com', password: '123123123' }),
    ).rejects.toThrow(SignInError.InvalidPasswordError);
  });
});
