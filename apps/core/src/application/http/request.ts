import RequestMetadata from './request-metadata';

import type { IncomingHttpHeaders } from 'node:http';

export default interface IRequest {
  headers: IncomingHttpHeaders & Record<string, string | undefined>;
  params: Record<string, string | number | undefined>;
  query: Record<string, string | string[] | number | boolean | undefined>;
  body: any;
  metadata: RequestMetadata;
}
