import { PrismaClient } from '@prisma/client';

import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import ShortenedLink from '@domain/entities/shortened-link';

import prismaShortenedLinkMappers from './mappers/prisma-shortened-link-mappers';

export default class PrismaShortenedLinksRepository implements IShortenedLinksRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsById(id: string): Promise<boolean> {
    return (await this.prisma.shortenedLink.count({ where: { id, deletedAt: null } })) > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    return (await this.prisma.shortenedLink.count({ where: { code, deletedAt: null } })) > 0;
  }

  async getAllByUserId(userId: string): Promise<ShortenedLink[]> {
    const shortenedLinksData = await this.prisma.shortenedLink.findMany({
      where: { createdByUserId: userId, deletedAt: null },
    });

    return shortenedLinksData.map(prismaShortenedLinkMappers.toDomain.shortenedLink);
  }

  async getById(id: string): Promise<ShortenedLink | null> {
    const shortenedLinkData = await this.prisma.shortenedLink.findUnique({
      where: { id, deletedAt: null },
    });

    return (
      shortenedLinkData && prismaShortenedLinkMappers.toDomain.shortenedLink(shortenedLinkData)
    );
  }

  async getByCode(code: string): Promise<ShortenedLink | null> {
    const shortenedLinkData = await this.prisma.shortenedLink.findUnique({
      where: { code, deletedAt: null },
    });

    return (
      shortenedLinkData && prismaShortenedLinkMappers.toDomain.shortenedLink(shortenedLinkData)
    );
  }

  async getByIdFromUser(id: string, userId: string): Promise<ShortenedLink | null> {
    const shortenedLinkData = await this.prisma.shortenedLink.findUnique({
      where: { id, createdByUserId: userId, deletedAt: null },
    });

    return (
      shortenedLinkData && prismaShortenedLinkMappers.toDomain.shortenedLink(shortenedLinkData)
    );
  }

  async save(shortenedLink: ShortenedLink): Promise<void> {
    const { id } = shortenedLink;

    await this.prisma.shortenedLink.upsert({
      where: { id, deletedAt: null },
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
    await this.prisma.shortenedLink.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
