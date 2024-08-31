import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';
import loggerBuilder from '@infra/logger';
import chalk from 'chalk';

import AccessShortenedLinkError from './access-shortened-link-errors';

const logger = loggerBuilder.context('ACCESS-SHORTENED-LINK/USE-CASE', 'magenta');

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
    await this.shortenedLinksRepo.save(shortenedLink);

    logger.debug(
      `Shortened link ${chalk.cyan(code)} accessed. Usage count upped to ${shortenedLink.usageCount}.`,
    );

    return {
      linkToRedirect: shortenedLink.link,
    };
  }
}
