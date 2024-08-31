import AccessShortenedLinkUseCase from '@application/usecases/access-shortened-link';
import GetMeUseCase from '@application/usecases/auth/get-me';
import SignInUseCase from '@application/usecases/auth/sign-in';
import SignUpUseCase from '@application/usecases/auth/sign-up';
import DeleteShortenedLinkUseCase from '@application/usecases/delete-shortened-link';
import GenerateShortenedLinkUseCase from '@application/usecases/generate-shortened-link';
import GetShortenedLinksUseCase from '@application/usecases/get-shortened-links';
import UpdateShortenedLinkUseCase from '@application/usecases/update-shortened-link';
import dependenciesHub from '@dependencies-hub';
import prisma from '@infra/database/prisma';
import PrismaShortenedLinksRepository from '@infra/database/prisma/repositories/prisma-shortened-links-repository';
import PrismaUsersRepository from '@infra/database/prisma/repositories/prisma-users-repository';
import logger from '@infra/logger';
import BCryptService from '@infra/services/bcrypt-service';
import JWTTokenService from '@infra/services/jwt-token-service';

export default function registerDependencies() {
  dependenciesHub.registryMany(
    ['repositories.shortened-links', new PrismaShortenedLinksRepository(prisma)],
    ['repositories.users', new PrismaUsersRepository(prisma)],
    ['services.crypt', new BCryptService()],
    ['services.token', new JWTTokenService()],
    ['usecases.authentication.get-me', new GetMeUseCase()],
    ['usecases.authentication.sign-in', new SignInUseCase()],
    ['usecases.authentication.sign-up', new SignUpUseCase()],
    ['usecases.access-shortened-link', new AccessShortenedLinkUseCase()],
    ['usecases.delete-shortened-link', new DeleteShortenedLinkUseCase()],
    ['usecases.generate-shortened-link', new GenerateShortenedLinkUseCase()],
    ['usecases.get-shortened-links', new GetShortenedLinksUseCase()],
    ['usecases.update-shortened-link', new UpdateShortenedLinkUseCase()],
  );

  logger.info('Dependencies registered');
}
