import { z } from 'zod';

import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import SignUpUseCase from '@application/usecases/auth/sign-up';
import SignUpError from '@application/usecases/auth/sign-up-errors';
import { Inject } from '@dependencies-hub';
import isStrongPassword, { WeakPasswordReason } from '@domain/services/is-strong-password';
import createValidator from '@shared/validator';
import ValidatorError from '@shared/validator-error';

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
    try {
      const { name, email, password } = bodyValidator(request.body);

      const passwordStatus = isStrongPassword(password);

      if (!passwordStatus.strong) {
        handleWithInvalidPassword(passwordStatus.reason);
      }

      const { accessToken, userId } = await this.signUp.execute({ name, email, password });

      return {
        $status: 201,
        accessToken,
        userId,
      };
    } catch (error) {
      if (error instanceof SignUpError.EmailAlreadyTakenError) {
        throw new HttpError({
          statusCode: 409,
          message: 'E-mail já cadastrado',
          request,
        });
      }

      throw error;
    }
  }
}

function handleWithInvalidPassword(reason: WeakPasswordReason) {
  switch (reason) {
    case 'requires-min-length':
      throw new ValidatorError({
        password: {
          error: 'min_length',
          message: 'A senha deve ter pelo menos 8 caracteres',
        },
      });
    case 'requires-letter':
      throw new ValidatorError({
        password: {
          error: 'invalid',
          message: 'A senha deve ter pelo menos uma letra minuscula e maiúscula',
        },
      });
    case 'requires-number':
      throw new ValidatorError({
        password: {
          error: 'invalid',
          message: 'A senha deve ter pelo menos um número',
        },
      });
    case 'requires-special-char':
      throw new ValidatorError({
        password: {
          error: 'invalid',
          message: 'A senha deve ter pelo menos um caractere especial',
        },
      });
    default:
      break;
  }
}
