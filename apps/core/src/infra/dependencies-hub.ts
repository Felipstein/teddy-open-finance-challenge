import IUsersRepository from '@application/repositories/users-repository';
import ICryptService from '@application/services/crypt-service';
import ITokenService from '@application/services/token-service';
import SignInUseCase from '@application/usecases/auth/sign-in';
import ErrorCode from '@shared/error-codes';

import InfrastructureError from './errors/infrastructure-error';

type InjectableDependencies = {
  'repositories.users': IUsersRepository;
  'services.crypt': ICryptService;
  'services.token': ITokenService;
  'usecases.authentication.sign-in': SignInUseCase;
};

type InjectableDependency = keyof InjectableDependencies;

function createDependenciesHub() {
  const dependencies = new Map<InjectableDependency, object>();

  function registry<T extends InjectableDependency>(
    dependency: T,
    injectable: InjectableDependencies[T],
  ) {
    dependencies.set(dependency, injectable);
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

export function Inject(dependency: InjectableDependency) {
  return (target: any, propertyKey: string) => {
    target[propertyKey] = new Proxy(
      {},
      {
        get(_, propertyKey) {
          const injectable = dependenciesHub.resolve(dependency);
          return (injectable as any)[propertyKey];
        },
      },
    );
  };
}

export default dependenciesHub;
