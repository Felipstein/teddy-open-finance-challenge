import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import UserNotFoundError from '@application/errors/user-not-found-error';
import HttpError from '@application/http/error';
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
    try {
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
    } catch (error) {
      if (error instanceof CodeAlreadyTakenError) {
        throw new HttpError({
          statusCode: 409,
          message: 'Código já em uso',
          request,
        });
      }

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
