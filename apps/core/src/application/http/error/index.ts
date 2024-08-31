import ErrorCode from '@shared/error-codes';

import IRequest from '../request';

import HttpErrorCode from './http-error-codes';

type Builder = {
  statusCode: HttpErrorCode;
  code?: ErrorCode;
  message: string;
  request: IRequest;
};

export default class HttpError extends Error {
  readonly code: ErrorCode;

  readonly statusCode: number;
  readonly request: IRequest;

  constructor(builder: Builder) {
    super(builder.message);

    this.code = builder.code ?? ErrorCode.UNKNOWN_ERROR;
    this.statusCode = builder.statusCode;
    this.request = builder.request;

    this.name = createErrorName(builder.statusCode);
  }
}

/**
 * Exemplo:
 * Recebe: 404
 * Retorna: NotFoundError
 */
function createErrorName(statusCode: HttpErrorCode) {
  const statusCodeStr = HttpErrorCode[statusCode];

  const words = statusCodeStr.split('_');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

  const errorName = capitalizedWords.join('').concat('Error');

  return errorName;
}
