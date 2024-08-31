import IResponse from '@application/http/response';

export default function createMockedResponse(fields?: Partial<jest.Mocked<IResponse>>) {
  const mockedResponse = {
    statusCode: fields?.statusCode ?? 200,
    body: fields?.body ?? {},
    headers: fields?.headers ?? {},
    sendStatus: fields?.sendStatus ?? jest.fn().mockReturnThis(),
    status: fields?.status ?? jest.fn().mockReturnThis(),
    json: fields?.json ?? jest.fn().mockReturnThis(),
    send: fields?.send ?? jest.fn().mockReturnThis(),
    write: fields?.write ?? jest.fn().mockReturnThis(),
    end: fields?.end ?? jest.fn().mockReturnThis(),
    next: fields?.next ?? jest.fn().mockReturnThis(),
  } satisfies jest.Mocked<IResponse>;

  return mockedResponse;
}
