import { z } from 'zod';

import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import DeleteShortenedLinkUseCase from '@application/usecases/delete-shortened-link';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';

const paramsValidator = createValidator(
  z.object({
    id: z.string().uuid(),
  }),
);

export default class DeleteShortenedLinkController extends Handler {
  @Inject('usecases.delete-shortened-link')
  private readonly deleteShortenedLink!: DeleteShortenedLinkUseCase;

  protected override async handle(request: IRequest) {
    try {
      const { id } = paramsValidator(request.params);

      await this.deleteShortenedLink.execute({ shortenedLinkId: id });
    } catch (error) {
      if (error instanceof ShortenedLinkNotFoundError) {
        throw new HttpError({
          statusCode: 404,
          message: 'Link não encontrado',
          request,
        });
      }

      throw error;
    }
  }
}
