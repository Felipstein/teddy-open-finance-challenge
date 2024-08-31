import createMock from '../../../tests/utils/create-mock';

import HttpError from './error';
import Handler from './handler';
import IRequest from './request';
import IResponse from './response';

const fakeRequest: IRequest = {
  headers: {},
  params: {},
  query: {},
  body: {},
  metadata: {
    isAuthenticated: false,
  },
};

describe('Handler', () => {
  const handler: jest.Mocked<Handler> = createMock();

  it('deve responder uma requisição com ResponseData e o preHandle trata-la corretamente', async () => {
    // @ts-ignore - A propriedade "handle" é protegida, logo só é acessível por herança ou internamente.
    handler.handle = jest.fn().mockResolvedValue({
      $status: 201,
      id: 'mock-id-created',
    });

    // @ts-expect-error - Não há necessidade de implementar todas as funções, apenas as quais devem ser testadas.
    const mockedResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as jest.Mocked<IResponse>;

    await handler.preHandle(fakeRequest, mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(201);
    expect(mockedResponse.json).toHaveBeenCalledWith({ id: 'mock-id-created' });
  });

  it('deve tratar uma exception e responder a requisição corretamente', async () => {
    // @ts-ignore - A propriedade "handle" é protegida, logo só é acessível por herança ou internamente.
    handler.handle = jest.fn().mockRejectedValue(
      new HttpError({
        statusCode: 404,
        message: 'Not found',
        request: fakeRequest,
      }),
    );

    // @ts-expect-error - Não há necessidade de implementar todas as funções, apenas as quais devem ser testadas.
    const mockedResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as jest.Mocked<IResponse>;

    try {
      // @ts-ignore - A propriedade "handle" é protegida, logo só é acessível por herança ou internamente.
      await handler.preHandle(fakeRequest, mockedResponse);
    } catch {}

    expect(mockedResponse.status).toHaveBeenCalledWith(404);
    expect(mockedResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Not found' }),
    );
  });
});
