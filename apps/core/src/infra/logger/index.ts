/* eslint-disable no-nested-ternary */

import chalk, { Chalk } from 'chalk';
import { clone } from 'lodash';
import winston from 'winston';

import env from '@env';

import { consoleTransport } from './console';

type Color = keyof Chalk;

function buildLogger() {
  const loggerInstance = winston.createLogger({
    level: env().LOG_LEVEL,
  });

  loggerInstance.add(consoleTransport);

  type Logger = winston.Logger & {
    context: (context: string, color?: Chalk | Color) => winston.Logger;
  };

  const logger = clone(loggerInstance) as Logger;

  logger.context = (context, color) => {
    const contextColored = color
      ? typeof color === 'string'
        ? // @ts-expect-error
          chalk[color](context)
        : color(context)
      : context;

    return logger.child({ _logs_context: contextColored });
  };

  return logger;
}

const logger = buildLogger();

if (env().NODE_ENV === 'test') {
  logger.silent = true;
}

export default logger;
