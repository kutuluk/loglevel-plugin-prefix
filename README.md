# loglevel-plugin-prefix

Plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing.

[![NPM version](https://img.shields.io/npm/v/loglevel-plugin-prefix.svg?style=flat-square)](https://www.npmjs.com/package/loglevel-plugin-prefix)[![Build Status](https://img.shields.io/travis/kutuluk/loglevel-plugin-prefix/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/loglevel-plugin-prefix)

## Installation

```sh
npm i loglevel-plugin-prefix --save
```

## API

**This plugin is under active development and should be considered as an unstable. No guarantees regarding API stability are made. Backward compatibility is guaranteed only by path releases.**

#### `reg(loglevel)`

This method must be called before any calling the apply method.

#### Parameters

`loglevel` - the root logger, imported from loglevel package

#### `apply(logger, options)`

This method applies the plugin to the logger. Before using this method, the `reg` method must be called, otherwise a warning will be logged. **From the next release, the call apply before reg will throw an error.**

#### Parameters

`logger` - a loglevel logger

`options` - an optional configuration object

```javascript
var defaults = {
  template: '[%t] %l:',
  timestampFormatter: function (date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  },
  levelFormatter: function (level) {
    return level.toUpperCase();
  },
  nameFormatter: function (name) {
    return name || 'root';
  },
  format: undefined
};
```

Plugin formats the prefix using **template** option as a printf-like format. The **template** is a string containing zero or more placeholder tokens. Each placeholder token is replaced with the value from loglevel messages parameters. Supported placeholders are:

- `%t` - timestamp of message
- `%l` - level of message
- `%n` - name of logger

The **timestampFormatter**, **levelFormatter** and **nameFormatter** is a functions for formatting corresponding values.

Alternatively, you can use **format** option. This is a function that receives formatted values (level, logger, timestamp) and should returns a prefix string. If the format option is present, the template option are ignored.


## Usage

### Browser directly
```html
<script src="https://unpkg.com/loglevel/dist/loglevel.min.js"></script>
<script src="https://unpkg.com/loglevel-plugin-prefix@^0.8/dist/loglevel-plugin-prefix.min.js"></script>

<script>
  var logger = log.noConflict();
  var prefixer = prefix.noConflict();
  prefixer.reg(logger);
  prefixer.apply(logger);
  logger.warn('prefixed message');
</script>
```

Output
```
[16:53:46] WARN: prefixed message
```

### Node
```javascript
const chalk = require('chalk');
const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');

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
```

Output
![output](https://raw.githubusercontent.com/kutuluk/loglevel-plugin-prefix/master/colored.png "output")

## Custom options

```javascript
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

log.enableAll();

prefix.apply(log, {
  template: '[%t] %l (%n) static text:',
  timestampFormatter(date) { return date.toISOString() },
  levelFormatter(level) { return level.toUpperCase() },
  nameFormatter(name) { return name || 'global' }
});

log.info('%s prefix', 'template');

const fn = (level, logger, timestamp) => {
  return `[${timestamp}] ${label} (${name}) static text:`;
};

prefix.apply(log, { format: fn });

log.info('%s prefix', 'functional');

prefix.apply(log, { template: '[%t] %l (%n) static text:' });

log.info('again %s prefix', 'template');
```

Output
```
[2017-05-29T12:53:46.000Z] INFO (global) static text: template prefix
[2017-05-29T12:53:46.000Z] INFO (global) static text: functional prefix
[2017-05-29T12:53:46.000Z] INFO (global) static text: again template prefix
```

## Option inheritance

```javascript
const log = require('loglevel');
const prefix = require('../lib/loglevel-plugin-prefix');

prefix.reg(log);
log.enableAll();

log.info('root');

const chicken = log.getLogger('chicken');
chicken.info('chicken');

prefix.apply(chicken, { template: '%l (%n):' });
chicken.info('chicken');

prefix.apply(log);
log.info('root');

const egg = log.getLogger('egg');
egg.info('egg');

const fn = (level, logger) => `${level} (${logger}):`;

prefix.apply(egg, { format: fn });
egg.info('egg');

prefix.apply(egg, {
  levelFormatter(level) {
    return level.toLowerCase();
  },
});
egg.info('egg');

chicken.info('chicken');
log.info('root');
```

Output
```
root
chicken
INFO (chicken): chicken
[13:20:24] INFO: root
[13:20:24] INFO: egg
INFO (egg): egg
info (egg): egg
INFO (chicken): chicken
[13:20:24] INFO: root
```
