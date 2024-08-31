/* eslint-disable no-param-reassign */

import util from 'node:util';

import env from '@env';
import dateUtils from '@shared/utils/date-utils';
import objectUtils from '@shared/utils/object-utils';
import chalk from 'chalk';
import { format, transports } from 'winston';

type PrintfFunction = typeof format.printf;
type PrintfCallback = Parameters<PrintfFunction>[0];
type PrintfCallbackParams = Parameters<PrintfCallback>;
type TransformableInfo = PrintfCallbackParams[0];

const LOG_TEMPLATE = '$[{{timestamp}}$] $[{{context}} $/ {{level}}$]$: {{message}}';

const SHOW_TIMESTAMP = env().NODE_ENV !== 'production';

function replaceTimestamp(template: string) {
  if (SHOW_TIMESTAMP) {
    const timestamp = dateUtils.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    template = template.replace('{{timestamp}}', chalk.gray(timestamp));
  } else {
    template = template.replace('{{timestamp}} ', '');
  }

  return template;
}

function replaceLevel(template: string, info: TransformableInfo) {
  return template.replace('{{level}}', chalk.bold(info.level));
}

function replaceContext(template: string, info: TransformableInfo) {
  const context = info.metadata?._logs_context;

  if (context) {
    delete info.metadata._logs_context;

    return template.replace('{{context}}', chalk.bold(context));
  }

  return template;
}

function replaceMessage(template: string, info: TransformableInfo) {
  let finalMessage: string = '';

  if (typeof info.message === 'string') {
    finalMessage = info.message;
  } else if (typeof info.message === 'object') {
    finalMessage = util.inspect(info.message, false, null, true);
  }

  if (typeof info.metadata === 'object') {
    finalMessage += ` ${util.inspect(info.metadata, false, null, true)}`;
  }

  const splat = info[Symbol.for('splat')];

  if (typeof splat === 'string') {
    finalMessage += ` ${splat}`;
  } else if (Array.isArray(splat)) {
    const hasMetadata = !!info.metadata;

    if (hasMetadata) {
      splat.splice(0, 1);
    }

    const splatMessage = splat
      .map((splatValue) =>
        typeof splatValue === 'object' ? util.inspect(splatValue, false, null, true) : splatValue,
      )
      .join(' ');

    finalMessage += ` ${splatMessage}`;
  }

  finalMessage = finalMessage.trim();

  return template.replace('{{message}}', `${finalMessage}`);
}

function cleanMessage(message: string) {
  return message
    .replace(/{{.+?}}/g, '')
    .replace(/\$\[\$\]/g, '')
    .replace(/undefined/g, '')
    .replace(/\[ \$\/ /g, '[')
    .trim();
}

/**
 * Apply gray color to special characters in the template.
 */
function applyGrayForCharacters(message: string) {
  return message
    .replace(/\$:/g, chalk.gray(':'))
    .replace(/\$\//g, chalk.gray('/'))
    .replace(/\$\[/g, chalk.gray('['))
    .replace(/\$\]/g, chalk.gray(']'));
}

const consoleFormat = format.combine(
  format((info) => {
    info.level = info.level.toUpperCase();

    return info;
  })(),

  format.metadata(),

  format.colorize(),

  format.printf((info) => {
    let template = LOG_TEMPLATE;

    template = replaceTimestamp(template);
    template = replaceLevel(template, info);
    template = replaceContext(template, info);

    if (objectUtils.isEmpty(info.metadata)) {
      delete info.metadata;
    }

    template = replaceMessage(template, info);
    const finalMessage = cleanMessage(template);

    return applyGrayForCharacters(finalMessage);
  }),
);

export const consoleTransport = new transports.Console({
  format: consoleFormat,
});
