import { z } from 'zod';

import UserNotFoundWithProvidedEmailError from '@application/errors/user-not-found-with-provided-email-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import SignInUseCase from '@application/usecases/auth/sign-in';
import SignInError from '@application/usecases/auth/sign-in.errors';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';

const bodyValidator = createValidator(
  z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string(),
  }),
);

export default class SignInController extends Handler {
  @Inject('usecases.authentication.sign-in') private readonly signIn!: SignInUseCase;

  protected override async handle(request: IRequest) {
    try {
      const { email, password } = bodyValidator(request.body);

      const { accessToken, userId } = await this.signIn.execute({ email, password });

      return {
        $status: 201,
        accessToken,
        userId,
      };
    } catch (error) {
      if (
        error instanceof UserNotFoundWithProvidedEmailError ||
        error instanceof SignInError.InvalidPasswordError
      ) {
        throw new HttpError({
          statusCode: 401,
          message: 'Credenciais inválidas',
          request,
        });
      }

      throw error;
    }
  }
}
