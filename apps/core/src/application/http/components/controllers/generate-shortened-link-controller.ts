import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import GenerateShortenedLinkUseCase from '@application/usecases/generate-shortened-link';
import { Inject } from '@dependencies-hub';
import createValidator from '@shared/validator';
import { z } from 'zod';

const bodyValidator = createValidator(
  z.object({
    link: z.string(),
    customCode: z.string().optional(),
    expiresIn: z.coerce.date().nullable().optional(),
  }),
);

export default class GenerateShortenedLinkController extends Handler {
  @Inject('usecases.generate-shortened-link')
  private readonly generateShortenedLink!: GenerateShortenedLinkUseCase;

  protected override async handle(request: IRequest) {
    const { link, customCode, expiresIn } = bodyValidator(request.body);
    const { userId } = request.metadata;

    const { code } = await this.generateShortenedLink.execute({
      link,
      createdByUserId: userId,
      customCode,
      expiresIn,
    });

    return {
      $status: 201,
      code,
    };
  }
}
