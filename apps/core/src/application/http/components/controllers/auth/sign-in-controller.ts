import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import SignInUseCase from '@application/usecases/auth/sign-in';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const bodyValidator = createValidator(
  z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string(),
  }),
);

export default class SignInController extends Handler {
  @Inject('usecases.authentication.sign-in') private readonly signIn!: SignInUseCase;

  protected override async handle(request: IRequest) {
    const { email, password } = bodyValidator(request.body);

    const { accessToken, userId } = await this.signIn.execute({ email, password });

    return {
      $status: 201,
      accessToken,
      userId,
    };
  }
}
