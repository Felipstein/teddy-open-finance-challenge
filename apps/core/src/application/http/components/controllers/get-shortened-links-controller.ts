import UserNotFoundError from '@application/errors/user-not-found-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import GetShortenedLinksUseCase from '@application/usecases/get-shortened-links';
import { Inject } from '@dependencies-hub';

export default class GetShortenedLinksController extends Handler {
  @Inject('usecases.get-shortened-links')
  private readonly getShortenedLinks!: GetShortenedLinksUseCase;

  protected override async handle(request: IRequest) {
    try {
      const userId = request.metadata.userId!;

      return this.getShortenedLinks.execute({ userId });
    } catch (error) {
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
