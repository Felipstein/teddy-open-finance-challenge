/* eslint-disable no-console */

import 'dotenv/config';

import chalk from 'chalk';
import { z, ZodError } from 'zod';

const envVariablesSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),

  PORT: z.coerce.number().default(3333),

  ORIGINS: z
    .string()
    .transform((value) => value.split(','))
    .or(z.array(z.string()))
    .default([]),

  ACCESS_TOKEN_SECRET_KEY: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),

  RETURN_HTTP_ERROR_DETAILS: z.coerce.boolean().default(false),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

let envParsed: z.infer<typeof envVariablesSchema>;

try {
  envParsed = envVariablesSchema.parse(process.env);
} catch (error: unknown) {
  if (error instanceof ZodError) {
    const { issues } = error;

    console.error(
      chalk.rgb(150, 0, 0).bold(`\n${issues.length} issues`),
      chalk.rgb(150, 0, 0)('found in environment variables:'),
    );
    issues.forEach((issue) => {
      console.error(
        chalk.gray(' -'),
        chalk.white.bold(issue.path.join('.')),
        chalk.red(issue.message),
      );
    });

    console.info(chalk.gray('\n----------------------------------------'));

    process.exit(1);
  }

  throw error;
}

export default function env() {
  return envParsed;
}

if (process.env.NODE_ENV !== 'test') {
  console.info(chalk.gray('Environment variables parsed and loaded\n'));
}
