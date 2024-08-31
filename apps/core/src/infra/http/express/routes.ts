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

const routes = Router();

routes.use(adaptHandler(InjectUserAuthenticatedMiddleware));

routes.post('/me', adaptHandler(GetMeController));
routes.post('/auth/sign-up', adaptHandler(SignUpController));
routes.post('/auth/sign-in', adaptHandler(SignInController));

routes.get('/:code', adaptHandler(AccessShortenedLinkController));
routes.get('/available/:code', adaptHandler(IsAvailableCodeController));

routes.get('/links', adaptHandler(GetShortenedLinksController));
routes.post('/links', adaptHandler(GenerateShortenedLinkController));
routes.put('/links/:id', adaptHandler(UpdateShortenedLinkController));
routes.delete('/links/:id', adaptHandler(DeleteShortenedLinkController));

export default routes;
