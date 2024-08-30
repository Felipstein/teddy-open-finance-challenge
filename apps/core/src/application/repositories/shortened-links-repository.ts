import ShortenedLink from '@domain/entities/shortened-link';

export default interface IShortenedLinksRepository {
  existsByCode(code: string): Promise<boolean>;

  save(shortenedLink: ShortenedLink): Promise<void>;
}
