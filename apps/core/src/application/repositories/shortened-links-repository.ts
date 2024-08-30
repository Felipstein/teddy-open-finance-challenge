import ShortenedLink from '@domain/entities/shortened-link';

export default interface IShortenedLinksRepository {
  existsByCode(code: string): Promise<boolean>;

  getAllByUserId(userId: string): Promise<ShortenedLink[]>;

  getById(id: string): Promise<ShortenedLink | null>;

  save(shortenedLink: ShortenedLink): Promise<void>;
}
