import { faker } from '@faker-js/faker';

import { EntityProps } from '@domain/entities/core/entity';
import ShortenedLink from '@domain/entities/shortened-link';
import User from '@domain/entities/user';
import generateRandomCode from '@domain/services/generate-random-code';
import generateRandomID from '@domain/services/generate-random-id';
import Email from '@domain/value-objects/email';
import ID from '@domain/value-objects/id';
import Name from '@domain/value-objects/name';
import numberUtils from '@shared/utils/number-utils';

function randomUser(fields?: Partial<EntityProps<User>> & { id?: string }) {
  return new User(fields?.id ? new ID(fields?.id) : generateRandomID(), {
    name: fields?.name ?? new Name(faker.person.fullName()),
    email: fields?.email ?? new Email(faker.internet.email()),
    hashedPassword: fields?.hashedPassword ?? faker.internet.password(),
    createdAt: fields?.createdAt ?? new Date(),
    updatedAt: fields?.updatedAt ?? new Date(),
    lastLoginAt: fields?.lastLoginAt ?? null,
  });
}

function randomShortenedLink(fields?: Partial<EntityProps<ShortenedLink>> & { id?: string }) {
  return new ShortenedLink(fields?.id ? new ID(fields?.id) : generateRandomID(), {
    code: fields?.code ?? generateRandomCode(),
    link: fields?.link ?? faker.internet.url(),
    createdByUserId: fields?.createdByUserId ?? null,
    createdAt: fields?.createdAt ?? new Date(),
    updatedAt: fields?.updatedAt ?? new Date(),
    expiresIn: fields?.expiresIn ?? null,
    usageCount: fields?.usageCount ?? numberUtils.random(200),
  });
}

const generate = {
  randomUser,
  randomShortenedLink,
};

export default generate;
