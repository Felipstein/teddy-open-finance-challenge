import IRequest from './request';
import IResponse from './response';

export type ResponseData = {};

export default abstract class Handler {
  /**
   * Você pode responder uma requisição retornando da função qualquer dado ou até definir o campo
   * $status para setar o status da resposta.
   *
   * Mas caso precise de uma resposta mais avançada, utilize o response recebido no segundo parâmetro.
   */
  abstract handle(request: IRequest, response: IResponse): Promise<ResponseData>;
}
