import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';

type Input = {
  shortenedLinkId: string;
  link?: string;
  customCode?: string;
  expiresIn?: Date | null;
};

type Output = void;

export default class UpdateShortenedLinkUseCase {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;

  async execute(input: Input): Promise<Output> {
    const { shortenedLinkId, ...data } = input;

    const shortenedLink = await this.shortenedLinksRepo.getById(shortenedLinkId);
    if (!shortenedLink) {
      throw new ShortenedLinkNotFoundError();
    }

    if (data.customCode) {
      const codeAlreadyTaken = await this.shortenedLinksRepo.existsByCode(data.customCode);
      if (codeAlreadyTaken) {
        throw new CodeAlreadyTakenError();
      }
    }

    if (data.link) shortenedLink.link = data.link;
    if (data.customCode) shortenedLink.code = data.customCode;
    if (data.expiresIn) shortenedLink.expiresIn = data.expiresIn;

    await this.shortenedLinksRepo.save(shortenedLink);
  }
}
