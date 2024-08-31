import ErrorCode from '@shared/error-codes';

import IRequest from '../request';

import HttpErrorCode from './http-error-codes';

type Builder = {
  statusCode?: HttpErrorCode;
  code?: ErrorCode;
  message: string;
  details?: unknown;
  request: IRequest;
};

export default class HttpError extends Error {
  readonly code: ErrorCode;

  readonly statusCode: number;
  readonly request: IRequest;
  readonly details?: unknown;

  constructor(builder: Builder) {
    super(builder.message);

    this.code = builder.code ?? ErrorCode.UNKNOWN_ERROR;
    this.statusCode = builder.statusCode ?? 400;
    this.details = builder.details;
    this.request = builder.request;

    this.name = createErrorName(builder.statusCode ?? 400);
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
