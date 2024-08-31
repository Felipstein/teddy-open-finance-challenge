import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import UpdateShortenedLinkUseCase from '@application/usecases/update-shortened-link';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const paramsValidator = createValidator(
  z.object({
    id: z.string().uuid(),
  }),
);

const bodyValidator = createValidator(
  z.object({
    link: z.string().optional(),
    customCode: z.string().optional(),
    expiresIn: z.date().nullable().optional(),
  }),
);

export default class UpdateShortenedLinkController extends Handler {
  @Inject('usecases.update-shortened-link')
  private readonly updateShortenedLink!: UpdateShortenedLinkUseCase;

  protected override async handle(request: IRequest) {
    const { id } = paramsValidator(request.params);
    const { link, customCode, expiresIn } = bodyValidator(request.body);

    await this.updateShortenedLink.execute({ shortenedLinkId: id, link, customCode, expiresIn });
  }
}
