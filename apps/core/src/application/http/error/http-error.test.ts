import ErrorCode from '@shared/error-codes';

import createFakeRequest from '../../../../tests/utils/create-fake-request';

import HttpError from '.';

describe('HttpError', () => {
  it('deve retornar detalhes do erro esperado', () => {
    const httpError = new HttpError({
      statusCode: 404,
      message: 'Not found',
      request: createFakeRequest(),
    });

    expect(httpError.name).toBe('NotFoundError');
    expect(httpError.code).toBe(ErrorCode.UNKNOWN_ERROR);
  });
});
