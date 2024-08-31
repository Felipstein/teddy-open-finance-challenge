import env from '@env';
import prisma from '@infra/database/prisma';
import server from '@infra/http/express/server';
import loggerBuilder from '@infra/logger';
import chalk from 'chalk';

const logger = loggerBuilder.context('SERVER', 'cyan');

async function main() {
  await checkConnections();

  await startServer(env().PORT);

  logger.info(`Server running at port ${chalk.bold(env().PORT)}`);
}

async function checkConnections() {
  logger.info(chalk.gray('Checking connections...'));

  try {
    await prisma.$connect();
  } catch (error) {
    logger.error(chalk.red('Error found in connections checked:'));
    logger.error(error);

    return process.exit(1);
  }

  logger.info(chalk.green('Connections checked'));
}

function startServer(port: number) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });
}

main();
