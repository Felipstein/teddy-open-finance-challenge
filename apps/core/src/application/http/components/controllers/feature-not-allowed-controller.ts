import Handler from '@application/http/handler';

export default class FeatureNotAllowedController extends Handler {
  protected override async handle() {
    return {
      $status: 405,
      message: 'Funcionalidade não permitida no momento',
    };
  }
}
