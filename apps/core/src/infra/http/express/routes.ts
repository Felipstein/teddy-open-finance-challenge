import AccessShortenedLinkController from '@application/http/components/controllers/access-shortened-link-controller';
import GetMeController from '@application/http/components/controllers/auth/get-me-controller';
import SignInController from '@application/http/components/controllers/auth/sign-in-controller';
import SignUpController from '@application/http/components/controllers/auth/sign-up-controller';
import DeleteShortenedLinkController from '@application/http/components/controllers/delete-shortened-link-controller';
import GenerateShortenedLinkController from '@application/http/components/controllers/generate-shortened-link-controller';
import GetShortenedLinksController from '@application/http/components/controllers/get-shortened-links-controller';
import IsAvailableCodeController from '@application/http/components/controllers/is-available-code-controller';
import UpdateShortenedLinkController from '@application/http/components/controllers/update-shortened-link-controller';
import InjectUserAuthenticatedMiddleware from '@application/http/components/middlewares/inject-user-authenticated-middleware';
import { Router } from 'express';

import adaptHandler from './adapters/adapt-handler';

export default function createRoutes() {
  const routes = Router();

  routes.use(adaptHandler(InjectUserAuthenticatedMiddleware));

  routes.get('/:code', adaptHandler(AccessShortenedLinkController));

  routes.get('/api/me', adaptHandler(GetMeController));
  routes.post('/api/auth/sign-up', adaptHandler(SignUpController));
  routes.post('/api/auth/sign-in', adaptHandler(SignInController));

  routes.get('/api/available/:code', adaptHandler(IsAvailableCodeController));

  routes.get('/api/links', adaptHandler(GetShortenedLinksController));
  routes.post('/api/links', adaptHandler(GenerateShortenedLinkController));
  routes.put('/api/links/:id', adaptHandler(UpdateShortenedLinkController));
  routes.delete('/api/links/:id', adaptHandler(DeleteShortenedLinkController));

  return routes;
}
