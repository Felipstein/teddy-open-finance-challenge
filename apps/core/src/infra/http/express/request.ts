import IRequest from '@application/http/request';
import RequestMetadata from '@application/http/request-metadata';

import type { Request as RawRequest } from 'express';
import type { IncomingHttpHeaders } from 'node:http';

export default class ExpressRequest implements IRequest {
  headers: IncomingHttpHeaders & Record<string, string | string[] | undefined>;
  params: Record<string, string | number | undefined>;
  query: Record<string, string | number | boolean | string[] | undefined>;
  body: any;
  metadata: RequestMetadata;
  protocol: string;

  constructor(raw: RawRequest) {
    this.headers = raw.headers;
    this.params = raw.params;
    this.query = raw.query as Record<string, string | number | boolean | string[] | undefined>;
    this.body = raw.body;
    this.metadata = raw.metadata;
    this.protocol = raw.protocol;
  }
}
