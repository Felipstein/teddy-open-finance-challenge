import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import applicationConfig from '@config/application-config';
import { Inject } from '@dependencies-hub';
import User from '@domain/entities/user';
import env from '@env';

import SignUpError from './sign-up-errors';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = {
  userId: string;
  accessToken: string;
};

export default class SignUpUseCase {
  @Inject('repositories.users') private readonly usersRepo!: IUsersRepository;
  @Inject('services.crypt') private readonly cryptService!: ICryptService;
  @Inject('services.token') private readonly tokenService!: ITokenService;

  async execute(input: Input): Promise<Output> {
    const { name, email, password } = input;

    const emailAlreadyTaken = await this.usersRepo.existsByEmail(email);
    if (emailAlreadyTaken) {
      throw new SignUpError.EmailAlreadyTakenError();
    }

    const hashedPassword = await this.cryptService.hash(
      password,
      applicationConfig.userPasswordHashSalt,
    );

    const user = User.create({
      name,
      email,
      hashedPassword,
    });

    const [, accessToken] = await Promise.all([
      this.usersRepo.save(user),
      this.tokenService.sign(
        { sub: user.id },
        env().ACCESS_TOKEN_SECRET_KEY,
        env().ACCESS_TOKEN_EXPIRES_IN,
      ),
    ]);

    return {
      userId: user.id,
      accessToken,
    };
  }
}
