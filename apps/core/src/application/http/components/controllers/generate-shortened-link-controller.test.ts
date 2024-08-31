import CodeAlreadyTakenError from '@application/errors/code-already-taken-error';
import UserNotFoundError from '@application/errors/user-not-found-error';
import IResponse from '@application/http/response';
import GenerateShortenedLinkUseCase from '@application/usecases/generate-shortened-link';
import dependenciesHub from '@dependencies-hub';

import createFakeRequest from '../../../../../tests/utils/create-fake-request';
import createMock from '../../../../../tests/utils/create-mock';
import createMockedResponse from '../../../../../tests/utils/create-mocked-response';

import GenerateShortenedLinkController from './generate-shortened-link-controller';

describe('GenerateShortenedLink Controller', () => {
  let response: jest.Mocked<IResponse>;

  const generateShortenedLinkUseCase: jest.Mocked<GenerateShortenedLinkUseCase> = createMock();
  let generateShortenedLink: GenerateShortenedLinkController;

  beforeEach(() => {
    response = createMockedResponse();

    dependenciesHub.registry('usecases.generate-shortened-link', generateShortenedLinkUseCase);

    generateShortenedLink = new GenerateShortenedLinkController();
  });

  it('deve gerar um link encurtado e retornar com domínio', async () => {
    generateShortenedLinkUseCase.execute = jest.fn().mockResolvedValue({ code: 'aNgEjG' });

    await generateShortenedLink.preHandle(
      createFakeRequest({
        protocol: 'http',
        headers: {
          host: 'localhost:3333',
        },
        body: {
          link: 'https://google.com',
        },
      }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      shortenedLink: 'http://localhost:3333/aNgEjG',
    });
  });

  it('deve lançar uma exception caso o header "host" não for providenciado', async () => {
    await generateShortenedLink.preHandle(
      createFakeRequest({
        protocol: 'http',
        body: {
          link: 'https://google.com',
        },
      }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('deve lançar uma exception de código já em uso', async () => {
    generateShortenedLinkUseCase.execute = jest.fn().mockRejectedValue(new CodeAlreadyTakenError());

    await generateShortenedLink.preHandle(
      createFakeRequest({
        protocol: 'http',
        headers: {
          host: 'localhost:3333',
        },
        body: {
          link: 'https://google.com',
        },
      }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(409);
  });

  it('deve lançar uma exception de usuário não encontrado', async () => {
    generateShortenedLinkUseCase.execute = jest.fn().mockRejectedValue(new UserNotFoundError());

    await generateShortenedLink.preHandle(
      createFakeRequest({
        protocol: 'http',
        headers: {
          host: 'localhost:3333',
        },
        body: {
          link: 'https://google.com',
        },
      }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(404);
  });
});
