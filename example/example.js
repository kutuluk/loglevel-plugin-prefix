/* eslint-disable vars-on-top */
var log = require('loglevel');
var prefix = require('../lib/loglevel-plugin-prefix');

log.enableAll();

log.info('root');

var child = log.getLogger('child');
prefix.apply(child, { template: '%l (%n):' });
child.info('child');

prefix.apply(log);
log.info('root');

var logger = log.getLogger('logger');
prefix.apply(logger);
logger.info('logger');
