import IRequest from './request';
import IResponse from './response';

export type ResponseData =
  | Record<string, any>
  | (Record<string, any> & { $status: number })
  | string
  | number
  | boolean
  | any[]
  | null;

export default abstract class Handler {
  async preHandle(request: IRequest, response: IResponse): Promise<IResponse> {
    const result = await this.handle(request, response);

    if (isResponseInstanceResult(result)) {
      return result;
    }

    let statusCode: number | undefined;
    let body: any;

    if (result && typeof result === 'object') {
      if ('$status' in result) {
        const { $status } = result;

        if (typeof $status !== 'number') {
          throw new TypeError('Field "$status" must be a number');
        }

        statusCode = $status;
        delete result.$status;
      }

      body = result;
    }

    if (isEmptyBody(body)) {
      return response.sendStatus(statusCode || 204);
    }

    return response.status(statusCode || 200).json(body);
  }

  /**
   * Você pode responder uma requisição retornando da função qualquer dado ou até definir o campo
   * $status para setar o status da resposta.
   *
   * Mas caso precise de uma resposta mais avançada, utilize o response recebido no segundo parâmetro.
   */
  protected abstract handle(
    request: IRequest,
    response: IResponse,
  ): Promise<ResponseData | IResponse | void>;
}

function isResponseInstanceResult(result: unknown): result is IResponse {
  return (
    !!result &&
    typeof result === 'object' &&
    'body' in result &&
    'json' in result &&
    'send' in result
  );
}

function isEmptyBody(body: any) {
  return !body || Object.keys(body).length === 0;
}
