import UserNotFoundErrorWithProvidedEmail from '@application/errors/user-not-found-with-provided-email-error';
import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import env from '@env';

import SignInError from './sign-in.errors';

type Input = {
  email: string;
  password: string;
};

type Output = {
  userId: string;
  accessToken: string;
};

export default class SignInUseCase {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly cryptService: ICryptService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { email, password } = input;

    const user = await this.usersRepo.getByEmail(email);
    if (!user) {
      throw new UserNotFoundErrorWithProvidedEmail();
    }

    if (!(await this.cryptService.compare(password, user.hashedPassword))) {
      throw new SignInError.InvalidPasswordError();
    }

    const accessToken = await this.tokenService.sign(
      { sub: user.id },
      env().ACCESS_TOKEN_SECRET_KEY,
      env().ACCESS_TOKEN_EXPIRES_IN,
    );

    return {
      userId: user.id,
      accessToken,
    };
  }
}
