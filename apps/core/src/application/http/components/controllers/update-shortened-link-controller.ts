import { z } from 'zod';

import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import UpdateShortenedLinkUseCase from '@application/usecases/update-shortened-link';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';

const paramsValidator = createValidator(
  z.object({
    id: z.string().uuid(),
  }),
);

const bodyValidator = createValidator(
  z.object({
    link: z.string().optional(),
    customCode: z.string().optional(),
    expiresIn: z.coerce
      .date()
      .refine((value) => (value ? value > new Date() : true), {
        message: 'A data precisa ser a partir de hoje',
      })
      .nullable()
      .optional(),
  }),
);

export default class UpdateShortenedLinkController extends Handler {
  @Inject('usecases.update-shortened-link')
  private readonly updateShortenedLink!: UpdateShortenedLinkUseCase;

  protected override async handle(request: IRequest) {
    try {
      const { id } = paramsValidator(request.params);
      const { link, customCode, expiresIn } = bodyValidator(request.body);

      await this.updateShortenedLink.execute({ shortenedLinkId: id, link, customCode, expiresIn });
    } catch (error) {
      if (error instanceof ShortenedLinkNotFoundError) {
        throw new HttpError({
          statusCode: 404,
          message: 'Link não encontrado',
          request,
        });
      }

      if (error instanceof CodeAlreadyTakenError) {
        throw new HttpError({
          statusCode: 409,
          message: 'Esse código já está em uso',
          request,
        });
      }

      throw error;
    }
  }
}
