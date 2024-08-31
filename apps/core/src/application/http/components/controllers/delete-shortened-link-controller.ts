import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import DeleteShortenedLinkUseCase from '@application/usecases/delete-shortened-link';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const paramsValidator = createValidator(
  z.object({
    id: z.string().uuid(),
  }),
);

export default class DeleteShortenedLinkController extends Handler {
  @Inject('usecases.delete-shortened-link')
  private readonly deleteShortenedLink!: DeleteShortenedLinkUseCase;

  protected override async handle(request: IRequest) {
    const { id } = paramsValidator(request.params);

    await this.deleteShortenedLink.execute({ shortenedLinkId: id });
  }
}
