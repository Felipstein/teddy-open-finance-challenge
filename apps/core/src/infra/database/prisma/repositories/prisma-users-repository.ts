import { PrismaClient } from '@prisma/client';

import IUsersRepository from '@application/repositories/users-repository';
import User from '@domain/entities/user';

import prismaUserMappers from './mappers/prisma-user-mappers';

export default class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsById(id: string): Promise<boolean> {
    return (await this.prisma.user.count({ where: { id, deletedAt: null } })) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.prisma.user.count({ where: { email, deletedAt: null } })) > 0;
  }

  async getById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });

    return userData && prismaUserMappers.toDomain.user(userData);
  }

  async getByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email, deletedAt: null } });

    return userData && prismaUserMappers.toDomain.user(userData);
  }

  async save(user: User): Promise<void> {
    const { id } = user;

    await this.prisma.user.upsert({
      where: { id, deletedAt: null },
      create: prismaUserMappers.toPrisma.user(user),
      update: {
        name: user.name,
        hashedPassword: user.hashedPassword,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  }
}
