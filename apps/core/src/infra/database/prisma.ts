import env from '@env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(
  env().PRISMA_LOGS ? { log: ['error', 'info', 'query', 'warn'] } : undefined,
);

export default prisma;
