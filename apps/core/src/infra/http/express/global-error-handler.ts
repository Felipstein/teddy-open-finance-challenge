import HttpErrorResponse from '@application/http/error/http-error-response';
import env from '@env';
import CoreError from '@shared/core-error';
import ErrorCode from '@shared/error-codes';
import { NextFunction, Request, Response } from 'express';

export default function globalErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  let errorResponse: HttpErrorResponse;

  if (env().NODE_ENV === 'production') {
    errorResponse = {
      message: 'Ocorreu um erro interno nos nossos servidores, tente novamente mais tarde.',
    };
  } else {
    let causedBy: ErrorCode | undefined;

    if (error instanceof CoreError) {
      causedBy = error.code;
    }

    errorResponse = {
      causedBy,
      message: error.message,
      internalDetails: {
        stack: error.stack,
      },
    };
  }

  return response.status(500).json(errorResponse);
}
