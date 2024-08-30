import ShortenedLink from '@domain/entities/shortened-link';

export default interface IShortenedLinksRepository {
  existsByCode(code: string): Promise<boolean>;

  getAllByUserId(userId: string): Promise<ShortenedLink[]>;

  save(shortenedLink: ShortenedLink): Promise<void>;
}
