import HttpError from '@application/http/error';
import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import IResponse from '@application/http/response';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const paramsValidator = createValidator(
  z.object({
    id: z.string().uuid(),
  }),
);

export default class IsLinkOwnerMiddleware extends Handler {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;

  protected override async handle(request: IRequest, response: IResponse) {
    const { id } = paramsValidator(request.params);
    const { userId } = request.metadata;

    if (!userId) {
      throw new HttpError({
        statusCode: 403,
        message: 'Você precisa estar autenticado para realizar uma operação dessa',
        request,
      });
    }

    const shortenedLink = await this.shortenedLinksRepo.getByIdFromUser(id, userId);
    if (!shortenedLink) {
      throw new HttpError({
        statusCode: 404,
        message: 'Link não encontrado',
        request,
      });
    }

    return response.next();
  }
}
