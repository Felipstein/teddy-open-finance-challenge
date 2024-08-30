import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import { Inject } from '@dependencies-hub';

type Input = {
  shortenedLinkId: string;
};

type Output = void;

export default class DeleteShortenedLinkUseCase {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;

  async execute(input: Input): Promise<Output> {
    const { shortenedLinkId } = input;

    const shortenedLinkExists = await this.shortenedLinksRepo.existsById(shortenedLinkId);
    if (!shortenedLinkExists) {
      throw new ShortenedLinkNotFoundError();
    }

    await this.shortenedLinksRepo.delete(shortenedLinkId);
  }
}
