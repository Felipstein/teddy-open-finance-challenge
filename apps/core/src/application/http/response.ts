import type { IncomingHttpHeaders } from 'node:http';

export default interface IResponse {
  statusCode: number;
  headers: IncomingHttpHeaders & Record<string, string | undefined>;
  body: any;

  status(statusCode: number): this;
  write(body: any): this;

  sendStatus(statusCode: number): this;
  send(body: any): this;
  json(body: any): this;

  end(): this;
  next(): this;
}
