import type { OutgoingHttpHeaders } from 'node:http';

export default interface IResponse {
  statusCode: number;
  headers: OutgoingHttpHeaders & Record<string, string | string[] | number | undefined>;
  body: any;

  status(statusCode: number): this;
  write(body: any): this;

  sendStatus(statusCode: number): this;
  send(body: any): this;
  json(body: any): this;

  redirect(url: string, statusCode?: number): this;

  end(): this;
  next(): this;
}
