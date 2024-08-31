import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';
import Code from '@domain/value-objects/code';
import createValidator from '@shared/validator';
import { z } from 'zod';

const paramsValidator = createValidator(
  z.object({
    code: z.string(),
  }),
);

export default class IsAvailableCodeController extends Handler {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;

  protected override async handle(request: IRequest) {
    const { code } = paramsValidator(request.params);

    /**
     * Checa se é um código válido
     */
    // eslint-disable-next-line no-new
    new Code(code);

    const alreadyTaken = await this.shortenedLinksRepo.existsByCode(code);

    return {
      available: !alreadyTaken,
    };
  }
}
