/* eslint-disable no-console */

import chalk from 'chalk';

import HttpErrorResponse from '@application/http/error/http-error-response';
import env from '@env';
import loggerBuilder from '@infra/logger';
import CoreError from '@shared/core-error';
import ErrorCode, { errorCodeToString } from '@shared/error-codes';
import { NextFunction, Request, Response } from 'express';

const logger = loggerBuilder.context('GLOBAL-ERROR-HANDLER', 'red');

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
      causedBy: causedBy ? errorCodeToString(causedBy) : undefined,
      message: error.message,
      internalDetails: {
        stack: error.stack,
      },
    };
  }

  logger.error(
    chalk.red(`An unknown error occurred in the request ${request.method} ${request.url}:`),
  );
  console.error(chalk.red('#############################'));
  console.error(error);
  console.error(chalk.red('#############################'));

  return response.status(500).json(errorResponse);
}
