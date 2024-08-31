import ErrorCode from '@shared/error-codes';

import IRequest from '../request';

type Builder = {
  statusCode: number;
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
  }
}
