import IResponse from '@application/http/response';

import type { Response as RawResponse } from 'express';
import type { OutgoingHttpHeaders } from 'node:http';

export default class ExpressResponse implements IResponse {
  statusCode: number;
  headers: OutgoingHttpHeaders & Record<string, string | string[] | number | undefined>;
  body: any;

  constructor(
    private rawResponse: RawResponse,
    private readonly rawNextFunction: () => void,
  ) {
    this.statusCode = rawResponse.statusCode;
    this.headers = rawResponse.getHeaders();
  }

  status(statusCode: number): this {
    this.rawResponse = this.rawResponse.status(statusCode);
    return this;
  }

  write(body: any): this {
    this.rawResponse.write(body);
    return this;
  }

  sendStatus(statusCode: number): this {
    this.rawResponse = this.rawResponse.sendStatus(statusCode);
    return this;
  }

  send(body: any): this {
    this.rawResponse = this.rawResponse.send(body);
    return this;
  }

  json(body: any): this {
    this.rawResponse = this.rawResponse.json(body);
    return this;
  }

  redirect(url: string, statusCode = 301): this {
    this.rawResponse.redirect(statusCode, url);
    return this;
  }

  end(): this {
    this.rawResponse = this.rawResponse.end();
    return this;
  }

  next(): this {
    this.rawNextFunction();
    return this;
  }
}
