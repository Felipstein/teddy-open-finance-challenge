import UserNotFoundError from '@application/errors/user-not-found-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import GetMeUseCase from '@application/usecases/auth/get-me';
import GetMeError from '@application/usecases/auth/get-me-errors';
import { Inject } from '@dependencies-hub';
import ErrorCode from '@shared/error-codes';

export default class GetMeController extends Handler {
  @Inject('usecases.authentication.get-me') private readonly getMe!: GetMeUseCase;

  protected override async handle(request: IRequest) {
    try {
      const accessToken = request.metadata.accessToken!;

      const user = await this.getMe.execute({ accessToken });

      return {
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof GetMeError.InvalidTokenError) {
        throw new HttpError({
          statusCode: 401,
          message: error.code === ErrorCode.INVALID_TOKEN ? 'Sessão inválida' : 'Sessão expirada',
          request,
        });
      }

      if (error instanceof UserNotFoundError) {
        throw new HttpError({
          statusCode: 404,
          message:
            'Seu cadastro não existe mais. Se você acha que isso é um erro, entre em contato com o suporte',
          request,
        });
      }

      throw error;
    }
  }
}
