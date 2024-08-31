import Handler from '@application/http/handler';
import RequestMetadata from '@application/http/request-metadata';
import loggerBuilder from '@infra/logger';
import chalk from 'chalk';
import { Handler as ExpressHandler } from 'express';

import ExpressRequest from '../request';
import ExpressResponse from '../response';

const logger = loggerBuilder.context('HANDLERS-ADAPTER', 'yellow');

export default function adaptHandler(handler: Handler): ExpressHandler;
export default function adaptHandler(handlerClass: new () => Handler): ExpressHandler;

export default function adaptHandler(
  handlerOrClass: Handler | (new () => Handler),
): ExpressHandler {
  // eslint-disable-next-line new-cap
  const handler = typeof handlerOrClass === 'function' ? new handlerOrClass() : handlerOrClass;

  logger.info(
    chalk.rgb(
      71,
      136,
      27,
    )(`Handler ${chalk.green.bold(handler.constructor.name)} adapted and registered`),
  );

  return async (rawRequest, rawResponse, next) => {
    if (!rawRequest.metadata) {
      rawRequest.metadata = createDefaultMetadataAttributes();
    }

    const request = new ExpressRequest(rawRequest);
    const response = new ExpressResponse(rawResponse, next);

    return handler.preHandle(request, response);
  };
}

function createDefaultMetadataAttributes(): RequestMetadata {
  return {
    isAuthenticated: false,
  };
}
