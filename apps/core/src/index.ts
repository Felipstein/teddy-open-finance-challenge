import env from '@env';
import server from '@infra/http/express/server';
import loggerBuilder from '@infra/logger';
import checkConnections from '@main/check-connections';
import registerDependencies from '@main/register-dependencies';
import chalk from 'chalk';

const logger = loggerBuilder.context('SERVER', 'cyan');

async function main() {
  await checkConnections();

  registerDependencies();

  await startServer(env().PORT);

  logger.info(`Server running at port ${chalk.bold(env().PORT)}`);
}

function startServer(port: number) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });
}

main();
