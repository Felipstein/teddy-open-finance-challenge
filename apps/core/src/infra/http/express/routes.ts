import InjectUserAuthenticatedMiddleware from '@application/http/components/middlewares/inject-user-authenticated-middleware';
import { Router } from 'express';

import adaptHandler from './adapters/adapt-handler';

const routes = Router();

routes.use(adaptHandler(InjectUserAuthenticatedMiddleware));

export default routes;
