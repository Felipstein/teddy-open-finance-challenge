import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import SignUpUseCase from '@application/usecases/auth/sign-up';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const bodyValidator = createValidator(
  z.object({
    name: z.string(),
    email: z.string().email('E-mail inválido'),
    password: z.string(),
  }),
);

export default class SignUpController extends Handler {
  @Inject('usecases.authentication.sign-up') private readonly signUp!: SignUpUseCase;

  protected override async handle(request: IRequest) {
    const { name, email, password } = bodyValidator(request.body);

    const { accessToken, userId } = await this.signUp.execute({ name, email, password });

    return {
      $status: 201,
      accessToken,
      userId,
    };
  }
}
