import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import UserNotFoundError from '@application/errors/user-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import IUsersRepository from '@application/repositories/users-repository';
import { Inject } from '@dependencies-hub';
import ShortenedLink from '@domain/entities/shortened-link';

type Input = {
  link: string;
  createdByUserId?: string;
  customCode?: string;
  expiresIn?: Date | null;
};

type Output = {
  code: string;
};

export default class GenerateShortenedLinkUseCase {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;
  @Inject('repositories.users')
  private readonly usersRepo!: IUsersRepository;

  async execute(input: Input): Promise<Output> {
    const { link, createdByUserId, customCode, expiresIn } = input;

    if (customCode) {
      const codeAlreadyTaken = await this.shortenedLinksRepo.existsByCode(customCode);
      if (codeAlreadyTaken) {
        throw new CodeAlreadyTakenError();
      }
    }

    if (createdByUserId) {
      const userExists = await this.usersRepo.existsById(createdByUserId);
      if (!userExists) {
        throw new UserNotFoundError();
      }
    }

    const shortenedLink = ShortenedLink.create({
      link,
      createdByUserId,
      customCode,
      expiresIn,
    });

    await this.shortenedLinksRepo.save(shortenedLink);

    return {
      code: shortenedLink.code,
    };
  }
}
