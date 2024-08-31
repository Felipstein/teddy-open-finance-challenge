import IResponse from '@application/http/response';

import createFakeRequest from '../../../../../tests/utils/create-fake-request';
import createMockedResponse from '../../../../../tests/utils/create-mocked-response';

import RequiresAuthenticationMiddleware from './requires-authentication-middleware';

describe('RequiresAuthenticationMiddleware', () => {
  let response: jest.Mocked<IResponse>;

  let requiresAuthenticationMiddleware: RequiresAuthenticationMiddleware;

  beforeEach(() => {
    response = createMockedResponse();
    requiresAuthenticationMiddleware = new RequiresAuthenticationMiddleware();
  });

  it('deve prosseguir com êxito caso o usuário esteja autenticado', async () => {
    const request = createFakeRequest({
      metadata: {
        isAuthenticated: true,
        accessToken: 'mock-token',
        userId: 'mock-id',
      },
    });
    await requiresAuthenticationMiddleware.preHandle(request, response);

    expect(response.next).toHaveBeenCalled();
  });

  it('deve lançar uma exception de não autorizado caso o usuário não esteja autenticado', async () => {
    await requiresAuthenticationMiddleware.preHandle(createFakeRequest(), response);

    expect(response.status).toHaveBeenCalledWith(401);
  });
});
