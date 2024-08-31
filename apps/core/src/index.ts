import env from '@env';
import server from '@infra/http/express/server';
import loggerBuilder from '@infra/logger';
import chalk from 'chalk';

const logger = loggerBuilder.context('SERVER', 'cyan');

function startServer(port: number) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });
}

async function main() {
  await startServer(env().PORT);

  logger.info(`Server running at port ${chalk.bold(env().PORT)}`);
}

main();
