const log = require('loglevel');
const prefix = require('../lib/loglevel-plugin-prefix');

log.enableAll();

log.info('root');

const chicken = log.getLogger('chicken');
prefix.apply(chicken, { template: '%l (%n):' });
chicken.info('chicken');

prefix.apply(log);
log.info('root');

const egg = log.getLogger('egg');
prefix.apply(egg);
egg.info('egg');

const fn = (level, logger) => {
  const label = level.toUpperCase();
  const name = logger || 'root';
  return `${label} (${name}):`;
};

prefix.apply(egg, { format: fn });
egg.info('egg');

prefix.apply(egg, {
  timestampFormatter(date) {
    return date.toISOString();
  },
});
egg.info('egg');

chicken.info('chicken');
log.info('root');
