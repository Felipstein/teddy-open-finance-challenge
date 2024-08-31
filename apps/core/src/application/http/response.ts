import type { IncomingHttpHeaders } from 'node:http';

export default interface IResponse {
  statusCode: number;
  headers: IncomingHttpHeaders & Record<string, string | undefined>;
  body: any;

  status(statusCode: number): this;
  write(body: any): this;

  sendStatus(statusCode: number): void;
  send(body: any): void;
  json(body: any): void;

  end(): void;
  next(): void;
}
