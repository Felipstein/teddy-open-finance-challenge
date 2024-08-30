import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';

import AccessShortenedLinkError from './access-shortened-link-errors';

type Input = {
  code: string;
};

type Output = {
  linkToRedirect: string;
};

export default class AccessShortenedLinkUseCase {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;

  async execute(input: Input): Promise<Output> {
    const { code } = input;

    const shortenedLink = await this.shortenedLinksRepo.getByCode(code);
    if (!shortenedLink) {
      throw new ShortenedLinkNotFoundError();
    }

    if (shortenedLink.isExpired()) {
      throw new AccessShortenedLinkError.ExpiredShortenedLinkError();
    }

    shortenedLink.incrementUsageCount();

    return {
      linkToRedirect: shortenedLink.link,
    };
  }
}
