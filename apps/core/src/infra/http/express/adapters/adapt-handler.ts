import Handler from '@application/http/handler';
import RequestMetadata from '@application/http/request-metadata';
import { Handler as ExpressHandler } from 'express';

import ExpressRequest from '../request';
import ExpressResponse from '../response';

export default function adaptHandler(handler: Handler): ExpressHandler {
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
