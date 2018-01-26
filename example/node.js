// eslint-disable-next-line import/no-extraneous-dependencies
const log = require('loglevel');
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk');
const prefix = require('../lib/loglevel-plugin-prefix');

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

prefix.reg(log);
log.enableAll();

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`(${name})`)}`;
  },
});

const critical = log.getLogger('critical');

prefix.apply(critical, {
  format(level, name, timestamp) {
    return chalk.red(`[${timestamp}] ${level} (${name}):`);
  },
});

log.trace('trace');
log.debug('debug');
critical.info('Something significant happened');
log.info('info');
log.warn('warn');
log.error('error');
