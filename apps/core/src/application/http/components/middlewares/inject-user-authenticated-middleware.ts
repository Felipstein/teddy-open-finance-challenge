import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import IResponse from '@application/http/response';
import IUsersRepository from '@application/repositories/users-repository';
import ITokenService from '@application/services/token-service';
import { Inject } from '@dependencies-hub';
import env from '@env';

export default class InjectUserAuthenticatedMiddleware extends Handler {
  @Inject('services.token') private readonly tokenService!: ITokenService;
  @Inject('repositories.users') private readonly usersRepo!: IUsersRepository;

  protected override async handle(request: IRequest, response: IResponse) {
    const { authorization } = request.headers;

    if (!authorization) {
      return response.next();
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      return response.next();
    }

    if (!token) {
      return response.next();
    }

    const { status, payload } = await this.tokenService.verifySafe(
      token,
      env().ACCESS_TOKEN_SECRET_KEY,
    );

    if (status === 'invalid') {
      request.metadata.noAuthReason = 'invalid-token';
      return response.next();
    }

    if (status === 'expired') {
      request.metadata.noAuthReason = 'expired-token';
      return response.next();
    }

    if (!payload?.sub || typeof payload.sub !== 'string') {
      throw new HttpError({
        message: 'Sua sessão está corrompida',
        request,
      });
    }

    const expectedUserId = payload.sub;
    const userExists = await this.usersRepo.existsById(expectedUserId);
    if (!userExists) {
      throw new HttpError({
        statusCode: 409,
        message:
          'Seu cadastro não existe mais, por favor, entre em contato com o suporte caso ache que isso é um erro',
        request,
      });
    }

    request.metadata.isAuthenticated = true;
    request.metadata.accessToken = token;
    request.metadata.userId = expectedUserId;

    return response.next();
  }
}
