import prisma from '@infra/database/prisma';
import loggerBuilder from '@infra/logger';
import chalk from 'chalk';

const logger = loggerBuilder.context('CONNECTIONS-CHECKUP', 'magenta');

export default async function checkConnections() {
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
