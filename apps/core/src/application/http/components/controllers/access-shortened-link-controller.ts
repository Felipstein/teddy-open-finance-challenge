import { z } from 'zod';

import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import IResponse from '@application/http/response';
import AccessShortenedLinkUseCase from '@application/usecases/access-shortened-link';
import AccessShortenedLinkError from '@application/usecases/access-shortened-link-errors';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';

const paramsValidator = createValidator(
  z.object({
    code: z.string(),
  }),
);

export default class AccessShortenedLinkController extends Handler {
  @Inject('usecases.access-shortened-link')
  private readonly accessShortenedLink!: AccessShortenedLinkUseCase;

  protected override async handle(request: IRequest, response: IResponse) {
    try {
      const { code } = paramsValidator(request.params);

      const { linkToRedirect } = await this.accessShortenedLink.execute({ code });

      return response.redirect(linkToRedirect);
    } catch (error) {
      if (error instanceof ShortenedLinkNotFoundError) {
        throw new HttpError({
          statusCode: 404,
          message: 'Link não encontrado',
          request,
        });
      }

      if (error instanceof AccessShortenedLinkError.ExpiredShortenedLinkError) {
        throw new HttpError({
          statusCode: 410,
          message: 'Este link expirou e não está mais disponível',
          request,
        });
      }

      throw error;
    }
  }
}
