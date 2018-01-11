# loglevel-plugin-prefix

Plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing.

[![NPM version](https://img.shields.io/npm/v/loglevel-plugin-prefix.svg?style=flat-square)](https://www.npmjs.com/package/loglevel-plugin-prefix)[![Build Status](https://img.shields.io/travis/kutuluk/loglevel-plugin-prefix/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/loglevel-plugin-prefix)

## Installation

```sh
npm i loglevel-plugin-prefix --save
```

## API

**This plugin is under active development and should be considered as an unstable. No guarantees regarding API stability are made. Backward compatibility is guaranteed only by path releases.**

#### `apply(logger, options)`

This method applies the plugin to the logger.

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
  }
};
```

Plugin formats the prefix using **template** option as a printf-like format. The **template** is a string containing zero or more placeholder tokens. Each placeholder token is replaced with the value from loglevel messages parameters. Supported placeholders are:

- `%t` - timestamp of message
- `%l` - level of message
- `%n` - name of logger

The **timestampFormatter**, **levelFormatter** and **nameFormatter** is a functions for formatting corresponding values.

Alternatively, you can use **format** option. This is a function with two arguments (level and logger), which should return a prefix string. If the format option is present, the other options are ignored.

## Usage

### Browser directly
```html
<script src="https://unpkg.com/loglevel/dist/loglevel.min.js"></script>
<script src="https://unpkg.com/loglevel-plugin-prefix@^0.7/dist/loglevel-plugin-prefix.min.js"></script>

<script>
  var logger = log.noConflict();
  var prefixer = prefix.noConflict();
  prefixer.apply(logger);
  logger.warn('prefixed message');
</script>
```

Output
```
[16:53:46] WARN: prefixed message
```

### ES6
```javascript
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

prefix.apply(log);
log.warn('prefixed message');
```

### CommonJS
```javascript
var log = require('loglevel');
var prefix = require('loglevel-plugin-prefix');

prefix.apply(log);
log.warn('prefixed message');
```

### AMD
```javascript
define(['loglevel', 'loglevel-plugin-prefix'], function(log, prefix) {
  prefix.apply(log);
  log.warn('prefixed message');
});
```

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

const fn = (level, logger) => {
  const timestamp = new Date().toISOString();
  const label = level.toUpperCase();
  const name = logger || 'global';
  return `[${timestamp}] ${label} (${name}) static text:`;
};

prefix.apply(log, { format: fn });

log.info('%s prefix', 'functional');
```

Output
```
[2017-05-29T12:53:46.000Z] INFO (global) static text: template prefix
[2017-05-29T12:53:46.000Z] INFO (global) static text: functional prefix
```

## Option inheritance

```javascript
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

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
```

Output
```
root
INFO (chicken): chicken
[16:53:46] INFO: root
[16:53:46] INFO: egg
INFO (egg): egg
[2017-05-29T12:53:46.000Z] INFO: egg
INFO (chicken): chicken
[16:53:46] INFO: root
```
