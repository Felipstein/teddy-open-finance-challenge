import IResponse from '@application/http/response';
import IUsersRepository from '@application/repositories/users-repository';
import ITokenService from '@application/services/token-service';
import dependenciesHub from '@dependencies-hub';

import createFakeRequest from '../../../../../tests/utils/create-fake-request';
import createMock from '../../../../../tests/utils/create-mock';
import createMockedResponse from '../../../../../tests/utils/create-mocked-response';

import InjectUserAuthenticatedMiddleware from './inject-user-authenticated-middleware';

describe('InjectUserAuthenticatedMiddleware', () => {
  let response: jest.Mocked<IResponse>;

  const tokenService: jest.Mocked<ITokenService> = createMock();
  const usersRepo: jest.Mocked<IUsersRepository> = createMock();
  let injectUserAuthenticated: InjectUserAuthenticatedMiddleware;

  beforeEach(() => {
    response = createMockedResponse();

    dependenciesHub.registryMany(
      ['services.token', tokenService],
      ['repositories.users', usersRepo],
    );

    injectUserAuthenticated = new InjectUserAuthenticatedMiddleware();
  });

  it('deve injetar com êxito o token e o id do usuário no metadata da requisição', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({
      status: 'valid',
      payload: { sub: 'mock-user-id' },
    });
    usersRepo.existsById = jest.fn().mockResolvedValue(true);

    const request = createFakeRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });
    await injectUserAuthenticated.preHandle(request, response);

    expect(request.metadata).toEqual(
      expect.objectContaining({
        isAuthenticated: true,
        accessToken: 'mock-access-token',
        userId: 'mock-user-id',
      }),
    );
  });

  it('deve ignorar caso o token não for providenciado porém injetado no metadata o motivo se o token for inválido', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({ status: 'invalid' });
    usersRepo.existsById = jest.fn().mockResolvedValue(true);

    const request = createFakeRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });
    await injectUserAuthenticated.preHandle(request, response);

    expect(request.metadata).toEqual(
      expect.objectContaining({
        noAuthReason: 'invalid-token',
        isAuthenticated: false,
      }),
    );
  });

  it('deve ignorar caso o token não for providenciado porém injetado no metadata o motivo se o token for expirado', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({ status: 'expired' });
    usersRepo.existsById = jest.fn().mockResolvedValue(true);

    const request = createFakeRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });
    await injectUserAuthenticated.preHandle(request, response);

    expect(request.metadata).toEqual(
      expect.objectContaining({
        noAuthReason: 'expired-token',
        isAuthenticated: false,
      }),
    );
  });

  it('deve ignorar caso o token não for providenciado', async () => {
    const request = createFakeRequest();
    await injectUserAuthenticated.preHandle(request, response);

    expect(response.next).toHaveBeenCalled();
    expect(request.metadata).toEqual(expect.objectContaining({ isAuthenticated: false }));
  });

  it('deve ignorar caso o token for providenciado incorretamente', async () => {
    const request = createFakeRequest({
      headers: {
        authorization: 'Basic abc',
      },
    });
    await injectUserAuthenticated.preHandle(request, response);

    expect(response.next).toHaveBeenCalled();
    expect(request.metadata).toEqual(expect.objectContaining({ isAuthenticated: false }));
  });

  it('deve lançar uma exception caso o token esteja corrompido', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({
      status: 'valid',
      payload: {},
    });

    const request = createFakeRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });

    await injectUserAuthenticated.preHandle(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Sua sessão está corrompida',
      }),
    );
  });

  it('deve lançar uma exception caso o usuário não exista', async () => {
    tokenService.verifySafe = jest.fn().mockResolvedValue({
      status: 'valid',
      payload: {
        sub: 'mock-user-id',
      },
    });
    usersRepo.existsById = jest.fn().mockResolvedValue(false);

    const request = createFakeRequest({
      headers: {
        authorization: 'Bearer mock-access-token',
      },
    });

    await injectUserAuthenticated.preHandle(request, response);

    expect(response.status).toHaveBeenCalledWith(409);
  });
});
