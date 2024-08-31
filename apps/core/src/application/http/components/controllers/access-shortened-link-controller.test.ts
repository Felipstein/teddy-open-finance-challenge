import ShortenedLinkNotFoundError from '@application/errors/shortened-link-not-found-error';
import IResponse from '@application/http/response';
import AccessShortenedLinkUseCase from '@application/usecases/access-shortened-link';
import AccessShortenedLinkError from '@application/usecases/access-shortened-link-errors';
import dependenciesHub from '@dependencies-hub';

import createFakeRequest from '../../../../../tests/utils/create-fake-request';
import createMock from '../../../../../tests/utils/create-mock';
import createMockedResponse from '../../../../../tests/utils/create-mocked-response';

import AccessShortenedLinkController from './access-shortened-link-controller';

describe('AccessShortenedLink Controller', () => {
  let response: jest.Mocked<IResponse>;

  const accessShortenedLinkUseCase: jest.Mocked<AccessShortenedLinkUseCase> = createMock();
  let accessShortenedLink: AccessShortenedLinkController;

  beforeEach(() => {
    response = createMockedResponse();

    dependenciesHub.registry('usecases.access-shortened-link', accessShortenedLinkUseCase);

    accessShortenedLink = new AccessShortenedLinkController();
  });

  it('deve ser redirecionado para o link original', async () => {
    accessShortenedLinkUseCase.execute = jest
      .fn()
      .mockResolvedValue({ linkToRedirect: 'https://google.com' });

    await accessShortenedLink.preHandle(
      createFakeRequest({ params: { code: 'aNgEjG' } }),
      response,
    );

    expect(response.redirect).toHaveBeenCalledWith('https://google.com');
  });

  it('deve lançar uma exception de "link" não encontrado', async () => {
    accessShortenedLinkUseCase.execute = jest
      .fn()
      .mockRejectedValue(new ShortenedLinkNotFoundError());

    await accessShortenedLink.preHandle(
      createFakeRequest({ params: { code: 'aNgEjG' } }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(404);
  });

  it('deve lançar uma exception de "link" expirado', async () => {
    accessShortenedLinkUseCase.execute = jest
      .fn()
      .mockRejectedValue(new AccessShortenedLinkError.ExpiredShortenedLinkError());

    await accessShortenedLink.preHandle(
      createFakeRequest({ params: { code: 'aNgEjG' } }),
      response,
    );

    expect(response.status).toHaveBeenCalledWith(410);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Este link expirou e não está mais disponível',
      }),
    );
  });
});
