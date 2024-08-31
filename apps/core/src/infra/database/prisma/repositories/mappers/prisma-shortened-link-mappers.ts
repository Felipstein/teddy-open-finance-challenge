import ShortenedLink from '@domain/entities/shortened-link';
import Code from '@domain/value-objects/code';
import ID from '@domain/value-objects/id';

import type * as Prisma from '@prisma/client';

const toDomain = {
  shortenedLink(prismaShortenedLink: Prisma.ShortenedLink): ShortenedLink {
    return new ShortenedLink(new ID(prismaShortenedLink.id), {
      code: new Code(prismaShortenedLink.code),
      link: prismaShortenedLink.link,
      createdByUserId: prismaShortenedLink.createdByUserId,
      usageCount: prismaShortenedLink.usageCount,
      createdAt: prismaShortenedLink.createdAt,
      updatedAt: prismaShortenedLink.updatedAt,
      expiresIn: prismaShortenedLink.expiresIn,
    });
  },
};

const toPrisma = {
  shortenedLink(domainShortenedLink: ShortenedLink): Omit<Prisma.ShortenedLink, 'deletedAt'> {
    return {
      id: domainShortenedLink.id,
      code: domainShortenedLink.code,
      link: domainShortenedLink.link,
      createdByUserId: domainShortenedLink.createdByUserId,
      usageCount: domainShortenedLink.usageCount,
      createdAt: domainShortenedLink.createdAt,
      updatedAt: domainShortenedLink.updatedAt,
      expiresIn: domainShortenedLink.expiresIn,
    };
  },
};

const prismaShortenedLinkMappers = {
  toDomain,
  toPrisma,
};

export default prismaShortenedLinkMappers;
