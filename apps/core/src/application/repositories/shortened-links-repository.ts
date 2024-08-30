import ShortenedLink from '@domain/entities/shortened-link';

export default interface IShortenedLinksRepository {
  existsById(id: string): Promise<boolean>;
  existsByCode(code: string): Promise<boolean>;

  getAllByUserId(userId: string): Promise<ShortenedLink[]>;

  getById(id: string): Promise<ShortenedLink | null>;
  getByCode(code: string): Promise<ShortenedLink | null>;

  save(shortenedLink: ShortenedLink): Promise<void>;

  delete(id: string): Promise<void>;
}
