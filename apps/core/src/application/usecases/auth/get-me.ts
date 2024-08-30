import UserNotFoundError from '@application/errors/user-not-found-error';
import IUsersRepository from '@application/repositories/users-repository';
import ITokenService from '@application/services/token-service';
import { Inject } from '@dependencies-hub';
import env from '@env';
import AccessTokenPayload from '@shared/@types/access-token-payload';

import GetMeError from './get-me-errors';

type Input = {
  accessToken: string;
};

type Output = {
  name: string;
  email: string;
};

export default class GetMeUseCase {
  @Inject('repositories.users') private readonly usersRepo!: IUsersRepository;
  @Inject('services.token') private readonly tokenService!: ITokenService;

  async execute(input: Input): Promise<Output> {
    const { accessToken } = input;

    const decoded = await this.tokenService.verifySafe<AccessTokenPayload>(
      accessToken,
      env().ACCESS_TOKEN_SECRET_KEY,
    );

    if (decoded.status !== 'valid') {
      throw new GetMeError.InvalidTokenError(decoded.status);
    }

    if (!decoded.payload.sub) {
      throw new GetMeError.InvalidTokenError('invalid', 'missing sub field');
    }

    if (typeof decoded.payload.sub !== 'string') {
      throw new GetMeError.InvalidTokenError('invalid', 'sub field is not a string');
    }

    const user = await this.usersRepo.getById(decoded.payload.sub);
    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      name: user.name,
      email: user.email,
    };
  }
}
