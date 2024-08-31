import Handler from '@application/http/handler';

export default class MockedHandler extends Handler {
  /**
   * Crie um mock do handle do jeito que for necessário para executar os testes.
   */
  constructor(override handle: Handler['handle']) {
    super();
  }
}
