/* eslint-disable no-console */

import InvalidValueObjectParseError from '@domain/errors/invalid-value-object-parse-error';
import env from '@env';
import loggerBuilder from '@infra/logger';
import ErrorCode, { errorCodeToString } from '@shared/error-codes';
import ValidatorError from '@shared/validator-error';
import chalk from 'chalk';

import HttpError from './error';
import HttpErrorResponse from './error/http-error-response';
import IRequest from './request';
import IResponse from './response';

export type ResponseData =
  | Record<string, any>
  | (Record<string, any> & { $status: number })
  | string
  | number
  | boolean
  | any[]
  | null;

export default abstract class Handler {
  async preHandle(request: IRequest, response: IResponse): Promise<IResponse> {
    try {
      const result = await this.handle(request, response);

      if (isResponseInstanceResult(result)) {
        return result;
      }

      let statusCode: number | undefined;
      let body: any;

      if (result && typeof result === 'object') {
        if ('$status' in result) {
          const { $status } = result;

          if (typeof $status !== 'number') {
            throw new TypeError('Field "$status" must be a number');
          }

          statusCode = $status;
          delete result.$status;
        }

        body = result;
      }

      if (isEmptyBody(body)) {
        return response.sendStatus(statusCode || 204);
      }

      return response.status(statusCode || 200).json(body);
    } catch (error) {
      if (error instanceof HttpError) {
        logError(error, this.constructor.name);

        const { statusCode, body } = transformHttpErrorToResponse(error);
        return response.status(statusCode).json(body);
      }

      if (error instanceof ValidatorError) {
        const httpError = new HttpError({
          message: 'Há campos incorretos ou incompletos',
          code: ErrorCode.INVALID_INPUT,
          details: error.issues,
          request,
        });

        logError(httpError, this.constructor.name);

        const { statusCode, body } = transformHttpErrorToResponse(httpError);
        return response.status(statusCode).json(body);
      }

      if (error instanceof InvalidValueObjectParseError) {
        const httpError = new HttpError({
          message: 'Há campos incorretos ou incompletos',
          code: error.code,
          request,
        });

        logError(httpError, this.constructor.name);

        const { statusCode, body } = transformHttpErrorToResponse(httpError);
        return response.status(statusCode).json(body);
      }

      /**
       * Deixe que a implementação defina o que deve fazer com erros desconhecidos
       */
      throw error;
    }
  }

  /**
   * Você pode responder uma requisição retornando da função qualquer dado ou até definir o campo
   * $status para setar o status da resposta.
   *
   * Mas caso precise de uma resposta mais avançada, utilize o response recebido no segundo parâmetro.
   */
  protected abstract handle(
    request: IRequest,
    response: IResponse,
  ): Promise<ResponseData | IResponse | void>;
}

function isResponseInstanceResult(result: unknown): result is IResponse {
  return (
    !!result &&
    typeof result === 'object' &&
    'status' in result &&
    'json' in result &&
    'send' in result
  );
}

function isEmptyBody(body: any) {
  return !body || Object.keys(body).length === 0;
}

function transformHttpErrorToResponse(error: HttpError) {
  const body: HttpErrorResponse = {
    causedBy: errorCodeToString(error.code),
    message: error.message,
    details: error.details,
  };

  if (env().RETURN_HTTP_ERROR_DETAILS) {
    body.internalDetails = {
      causedByUserId: error.request.metadata.userId,
      stack: error.stack,
    };
  }

  return { statusCode: error.statusCode, body };
}

function logError(error: HttpError, handlerName: string) {
  if (!env().LOG_400_HTTP_ERRORS) {
    return;
  }

  const logger = loggerBuilder.context(`HANDLER/${handlerName}`, 'blue');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { request, ...prettyError } = error;

  logger.warn(chalk.yellow(`An client error occurred in handler ${handlerName}:`));
  console.warn(chalk.yellow('##########################################'));
  console.warn(prettyError);
  console.warn(chalk.yellow('##########################################'));
}
