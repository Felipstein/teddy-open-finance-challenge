import UserNotFoundError from '@application/errors/user-not-found-error';
import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import IUsersRepository from '@application/repositories/users-repository';
import { Inject } from '@dependencies-hub';

type Input = {
  userId: string;
};

type Output = Array<{
  id: string;
  code: string;
  usageCount: number;
  createdAt: Date;
}>;

export default class GetShortenedLinksUseCase {
  @Inject('repositories.shortened-links')
  private readonly shortenedLinksRepo!: IShortenedLinksRepository;
  @Inject('repositories.users') private readonly usersRepo!: IUsersRepository;

  async execute(input: Input): Promise<Output> {
    const { userId } = input;

    const userExists = await this.usersRepo.existsById(userId);
    if (!userExists) {
      throw new UserNotFoundError();
    }

    const shortenedLinks = await this.shortenedLinksRepo.getAllByUserId(userId);

    return shortenedLinks.map((shortenedLink) => ({
      id: shortenedLink.id,
      code: shortenedLink.code,
      usageCount: shortenedLink.usageCount,
      createdAt: shortenedLink.createdAt,
    }));
  }
}
