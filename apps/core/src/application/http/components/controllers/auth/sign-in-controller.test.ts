import IResponse from '@application/http/response';
import SignInUseCase from '@application/usecases/auth/sign-in';
import SignInError from '@application/usecases/auth/sign-in.errors';
import dependenciesHub from '@dependencies-hub';
import ErrorCode from '@shared/error-codes';

import createFakeRequest from '../../../../../../tests/utils/create-fake-request';
import createMock from '../../../../../../tests/utils/create-mock';
import createMockedResponse from '../../../../../../tests/utils/create-mocked-response';

import SignInController from './sign-in-controller';

describe('SignInController', () => {
  let response: jest.Mocked<IResponse>;

  const signInUseCase: jest.Mocked<SignInUseCase> = createMock();
  let signInController: SignInController;

  beforeEach(() => {
    response = createMockedResponse();

    dependenciesHub.registry('usecases.authentication.sign-in', signInUseCase);

    signInController = new SignInController();
  });

  it('deve executar sem erros', async () => {
    signInUseCase.execute = jest.fn().mockResolvedValue({
      userId: 'mock-id',
      accessToken: 'mock-token',
    });

    const request = createFakeRequest({
      body: {
        email: 'johndoe@example.com',
        password: 'Str0ngP4ssw0rd!',
      },
    });
    await signInController.preHandle(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      userId: 'mock-id',
      accessToken: 'mock-token',
    });
  });

  it.each([
    { email: 'invalid-email', password: 'Str0ngP4ssw0rd!' },
    { email: 123312, password: 'weakpassword' },
    { email: 'johndoe@example.com', password: 123 },
    { email: 'email' },
  ])('deve executar com erro de input', async (invalidInput) => {
    const request = createFakeRequest({ body: invalidInput });

    await signInController.preHandle(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        causedBy: ErrorCode.INVALID_INPUT,
        details: expect.any(Object),
      }),
    );
  });

  it('deve executar com erro de credenciais inválidas', async () => {
    signInUseCase.execute = jest.fn().mockRejectedValue(new SignInError.InvalidPasswordError());

    const request = createFakeRequest({
      body: {
        email: 'johndoe@example.com',
        password: 'Str0ngP4ssw0rd!',
      },
    });
    await signInController.preHandle(request, response);

    expect(response.status).toHaveBeenCalledWith(401);
  });
});
