import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import GetShortenedLinksUseCase from '@application/usecases/get-shortened-links';
import { Inject } from '@dependencies-hub';

export default class GetShortenedLinksController extends Handler {
  @Inject('usecases.get-shortened-links')
  private readonly getShortenedLinks!: GetShortenedLinksUseCase;

  protected override async handle(request: IRequest) {
    const userId = request.metadata.userId!;

    return this.getShortenedLinks.execute({ userId });
  }
}
