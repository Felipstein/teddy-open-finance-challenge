import Handler from '@application/http/handler';

export default class TooManyRequestsController extends Handler {
  protected override async handle() {
    return {
      $status: 429,
      message: 'Muitas requisições. Tente novamente mais tarde',
    };
  }
}
