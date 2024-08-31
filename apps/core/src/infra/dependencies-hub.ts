import IShortenedLinksRepository from '@application/repositories/shortened-links-repository';
import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import AccessShortenedLinkUseCase from '@application/usecases/access-shortened-link';
import GetMeUseCase from '@application/usecases/auth/get-me';
import SignInUseCase from '@application/usecases/auth/sign-in';
import SignUpUseCase from '@application/usecases/auth/sign-up';
import DeleteShortenedLinkUseCase from '@application/usecases/delete-shortened-link';
import GenerateShortenedLinkUseCase from '@application/usecases/generate-shortened-link';
import GetShortenedLinksUseCase from '@application/usecases/get-shortened-links';
import UpdateShortenedLinkUseCase from '@application/usecases/update-shortened-link';
import ErrorCode from '@shared/error-codes';
import chalk from 'chalk';

import InfrastructureError from './errors/infrastructure-error';
import loggerBuilder from './logger';

const logger = loggerBuilder.context('DEPENDENCIES-HUB', 'cyan');

type InjectableDependencies = {
  'repositories.users': IUsersRepository;
  'repositories.shortened-links': IShortenedLinksRepository;
  'services.crypt': ICryptService;
  'services.token': ITokenService;
  'usecases.authentication.get-me': GetMeUseCase;
  'usecases.authentication.sign-in': SignInUseCase;
  'usecases.authentication.sign-up': SignUpUseCase;
  'usecases.access-shortened-link': AccessShortenedLinkUseCase;
  'usecases.delete-shortened-link': DeleteShortenedLinkUseCase;
  'usecases.generate-shortened-link': GenerateShortenedLinkUseCase;
  'usecases.get-shortened-links': GetShortenedLinksUseCase;
  'usecases.update-shortened-link': UpdateShortenedLinkUseCase;
};

type InjectableDependency = keyof InjectableDependencies;

function createDependenciesHub() {
  const dependencies = new Map<InjectableDependency, object>();

  function registry<T extends InjectableDependency>(
    dependency: T,
    injectable: InjectableDependencies[T],
  ) {
    dependencies.set(dependency, injectable);

    logger.debug(chalk.magenta.italic(`Dependency ${dependency} registered`));
  }

  function registryMany(
    ...pairs: [InjectableDependency, InjectableDependencies[keyof InjectableDependencies]][]
  ) {
    pairs.forEach(([dependency, injectable]) => registry(dependency, injectable));
  }

  function resolve<T extends InjectableDependency>(dependency: T) {
    const injectable = dependencies.get(dependency);

    if (!injectable) {
      throw new InfrastructureError(
        ErrorCode.INTERNAL_ERROR,
        `Dependency "${dependency}" not registered`,
      );
    }

    return injectable as InjectableDependencies[T];
  }

  function clear() {
    dependencies.clear();
  }

  return { registry, registryMany, resolve, _clear: clear };
}

const dependenciesHub = createDependenciesHub();

export type InjectDecoratorFn<T extends InjectableDependency> = (
  target: any,
  context: ClassFieldDecoratorContext,
) => (initializer: unknown) => InjectableDependencies[T];

export function Inject<TInjectableDependency extends InjectableDependency>(
  dependency: TInjectableDependency,
): InjectDecoratorFn<TInjectableDependency> {
  return () => () => dependenciesHub.resolve(dependency);
}

export default dependenciesHub;
