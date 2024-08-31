import chalk from 'chalk';

import env from '@env';
import createServer from '@infra/http/express/server';
import loggerBuilder from '@infra/logger';
import checkConnections from '@main/check-connections';
import registerDependencies from '@main/register-dependencies';

const logger = loggerBuilder.context('SERVER', 'cyan');

async function main() {
  registerDependencies();
  await checkConnections();

  const server = createServer();
  await server.listen(env().PORT);

  logger.info(`Server running at port ${chalk.bold(env().PORT)}`);
}

main();
