import IRequest from '@application/http/request';

export default function createFakeRequest(fields?: Partial<IRequest>): IRequest {
  return {
    headers: fields?.headers ?? {},
    params: fields?.params ?? {},
    query: fields?.query ?? {},
    metadata: fields?.metadata ?? {
      isAuthenticated: false,
    },
    body: fields?.body ?? {},
  };
}
