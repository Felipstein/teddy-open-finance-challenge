import Handler from '@application/http/handler';
import IRequest from '@application/http/request';
import GetMeUseCase from '@application/usecases/auth/get-me';
import { Inject } from '@dependencies-hub';

export default class GetMeController extends Handler {
  @Inject('usecases.authentication.get-me') private readonly getMe!: GetMeUseCase;

  protected override async handle(request: IRequest) {
    const accessToken = request.metadata.accessToken!;

    const user = await this.getMe.execute({ accessToken });

    return {
      name: user.name,
      email: user.email,
    };
  }
}
