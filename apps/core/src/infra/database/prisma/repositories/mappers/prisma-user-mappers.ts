import User from '@domain/entities/user';
import Email from '@domain/value-objects/email';
import ID from '@domain/value-objects/id';
import Name from '@domain/value-objects/name';

import type * as Prisma from '@prisma/client';

const toDomain = {
  user(prismaUser: Prisma.User): User {
    return new User(new ID(prismaUser.id), {
      name: new Name(prismaUser.name),
      email: new Email(prismaUser.email),
      hashedPassword: prismaUser.hashedPassword,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastLoginAt: prismaUser.lastLoginAt,
    });
  },
};

const toPrisma = {
  user(domainUser: User): Omit<Prisma.User, 'deletedAt'> {
    return {
      id: domainUser.id,
      name: domainUser.name,
      email: domainUser.email,
      hashedPassword: domainUser.hashedPassword,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
      lastLoginAt: domainUser.lastLoginAt,
    };
  },
};

const prismaUserMappers = {
  toDomain,
  toPrisma,
};

export default prismaUserMappers;
