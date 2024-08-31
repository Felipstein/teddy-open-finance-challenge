import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import IResponse from '@application/http/response';

export default class RequiresAuthenticationMiddleware extends Handler {
  protected override async handle(request: IRequest, response: IResponse) {
    if (!request.metadata.isAuthenticated) {
      throw new HttpError({
        statusCode: 401,
        message: 'Requer autenticação',
        request,
      });
    }

    return response.next();
  }
}
