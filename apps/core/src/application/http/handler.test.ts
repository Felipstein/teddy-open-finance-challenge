import createFakeRequest from '../../../tests/utils/create-fake-request';
import createMockedResponse from '../../../tests/utils/create-mocked-response';
import MockedHandler from '../../../tests/utils/mocked-handler';

import HttpError from './error';
import IResponse from './response';

describe('Handler', () => {
  let response: jest.Mocked<IResponse>;

  beforeEach(() => {
    response = createMockedResponse();
  });

  it('deve responder uma requisição com ResponseData e o preHandle trata-la corretamente', async () => {
    const handler = new MockedHandler(
      jest.fn().mockResolvedValue({
        $status: 201,
        id: 'mock-id-created',
      }),
    );

    await handler.preHandle(createFakeRequest(), response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ id: 'mock-id-created' });
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

    try {
      await handler.preHandle(createFakeRequest(), response);
    } catch {}

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not found' }));
  });
});
