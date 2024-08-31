import { PrismaClient } from '@prisma/client';

import env from '@env';

const prisma = new PrismaClient(
  env().PRISMA_LOGS ? { log: ['error', 'info', 'query', 'warn'] } : undefined,
);

export default prisma;
