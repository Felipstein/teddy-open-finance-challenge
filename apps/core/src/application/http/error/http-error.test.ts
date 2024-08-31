import ErrorCode from '@shared/error-codes';

import IRequest from '../request';

import HttpError from '.';

const fakeRequest: IRequest = {
  headers: {},
  params: {},
  query: {},
  metadata: {
    isAuthenticated: false,
  },
  body: {},
};

describe('HttpError', () => {
  it('deve retornar detalhes do erro esperado', () => {
    const httpError = new HttpError({
      statusCode: 404,
      message: 'Not found',
      request: fakeRequest,
    });

    expect(httpError.name).toBe('BadRequestError');
    expect(httpError.code).toBe(ErrorCode.UNKNOWN_ERROR);
  });
});
