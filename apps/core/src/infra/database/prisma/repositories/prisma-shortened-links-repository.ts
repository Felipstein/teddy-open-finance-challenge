import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import ShortenedLink from '@domain/entities/shortened-link';
import { PrismaClient } from '@prisma/client';

import prismaShortenedLinkMappers from './mappers/prisma-shortened-link-mappers';

export default class PrismaShortenedLinksRepository implements IShortenedLinksRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsById(id: string): Promise<boolean> {
    return (await this.prisma.shortenedLink.count({ where: { id } })) > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    return (await this.prisma.shortenedLink.count({ where: { code } })) > 0;
  }

  async getAllByUserId(userId: string): Promise<ShortenedLink[]> {
    const shortenedLinksData = await this.prisma.shortenedLink.findMany({
      where: { createdByUserId: userId },
    });

    return shortenedLinksData.map(prismaShortenedLinkMappers.toDomain.shortenedLink);
  }

  async getById(id: string): Promise<ShortenedLink | null> {
    const shortenedLinkData = await this.prisma.shortenedLink.findUnique({ where: { id } });

    return (
      shortenedLinkData && prismaShortenedLinkMappers.toDomain.shortenedLink(shortenedLinkData)
    );
  }

  async getByCode(code: string): Promise<ShortenedLink | null> {
    const shortenedLinkData = await this.prisma.shortenedLink.findUnique({ where: { code } });

    return (
      shortenedLinkData && prismaShortenedLinkMappers.toDomain.shortenedLink(shortenedLinkData)
    );
  }

  async save(shortenedLink: ShortenedLink): Promise<void> {
    const { id } = shortenedLink;

    await this.prisma.shortenedLink.upsert({
      where: { id },
      create: prismaShortenedLinkMappers.toPrisma.shortenedLink(shortenedLink),
      update: {
        code: shortenedLink.code,
        link: shortenedLink.link,
        expiresIn: shortenedLink.expiresIn,
        usageCount: shortenedLink.usageCount,
        updatedAt: shortenedLink.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shortenedLink.delete({ where: { id } });
  }
}
