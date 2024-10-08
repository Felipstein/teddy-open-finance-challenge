import 'express-async-errors';

import http from 'node:http';

import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import FeatureNotAllowedController from '@application/http/components/controllers/feature-not-allowed-controller';
import TooManyRequestsController from '@application/http/components/controllers/too-many-requests-controller';
import infraConfig from '@config/infra-config';
import env from '@env';
import { setupSwagger } from '@swagger';
import express from 'express';

import adaptHandler from './adapters/adapt-handler';
import globalErrorHandler from './global-error-handler';
import createRoutes from './routes';

export default function createServer() {
  const app = express();
  const server = http.createServer(app);

  setupSwagger(app);

  app.use(express.json());
  app.use(compression());
  app.use(helmet());

  app.use(
    cors({
      origin(requestOrigin, callback) {
        if (!requestOrigin) {
          return callback(null, true);
        }

        if (env().ORIGINS.includes(requestOrigin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${requestOrigin} blocked by CORS`), false);
      },
    }),
  );

  app.use(
    rateLimit({
      limit: infraConfig.rateLimit,
      windowMs: infraConfig.rateCooldown,
      handler: adaptHandler(TooManyRequestsController),
    }),
  );

  app.use(createRoutes());

  app.use('*', adaptHandler(FeatureNotAllowedController));
  app.use(globalErrorHandler);

  function listen(port: number) {
    return new Promise<void>((resolve) => {
      server.listen(port, resolve);
    });
  }

  return {
    ...server,
    listen,
  };
}
