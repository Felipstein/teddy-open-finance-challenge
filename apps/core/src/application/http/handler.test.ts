import createFakeRequest from '../../../tests/utils/create-fake-request';

import HttpError from './error';
import Handler from './handler';
import IResponse from './response';

class MockedHandler extends Handler {
  /**
   * Crie um mock do handle do jeito que for necessário para executar os testes.
   */
  constructor(override handle: Handler['handle']) {
    super();
  }
}

describe('Handler', () => {
  it('deve responder uma requisição com ResponseData e o preHandle trata-la corretamente', async () => {
    const handler = new MockedHandler(
      jest.fn().mockResolvedValue({
        $status: 201,
        id: 'mock-id-created',
      }),
    );

    // @ts-expect-error - Não há necessidade de implementar todas as funções, apenas as quais devem ser testadas.
    const mockedResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as jest.Mocked<IResponse>;

    await handler.preHandle(createFakeRequest(), mockedResponse);

    expect(mockedResponse.status).toHaveBeenCalledWith(201);
    expect(mockedResponse.json).toHaveBeenCalledWith({ id: 'mock-id-created' });
  });

  it('deve tratar uma exception e responder a requisição corretamente', async () => {
    const handler = new MockedHandler(
      jest.fn().mockRejectedValue(
        new HttpError({
          statusCode: 404,
          message: 'Not found',
          request: createFakeRequest(),
        }),
      ),
    );

    // @ts-expect-error - Não há necessidade de implementar todas as funções, apenas as quais devem ser testadas.
    const mockedResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as jest.Mocked<IResponse>;

    try {
      await handler.preHandle(createFakeRequest(), mockedResponse);
    } catch {}

    expect(mockedResponse.status).toHaveBeenCalledWith(404);
    expect(mockedResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Not found' }),
    );
  });
});
