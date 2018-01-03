# loglevel-plugin-prefix
Plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation

```sh
npm install loglevel-plugin-prefix --save
```

## API

```javascript
apply(log[, options]);
```

This method applies the plugin to the logger.

**log** - loglevel logger

**options** - configuration object

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

Plugin formats the prefix using **template** option as a printf-like format.

The **template** is a string containing zero or more placeholder tokens. Each placeholder token is replaced with the value from loglevel messages parameters. Supported placeholders are:

- %t - timestamp of message
- %l - level of message
- %n - name of logger

The **timestampFormatter**, **levelFormatter** and **nameFormatter** is a functions for formatting corresponding values

## Base usage

### Browser directly
```html
<script src="https://unpkg.com/loglevel/dist/loglevel.min.js"></script>
<script src="https://unpkg.com/loglevel-plugin-prefix/dist/loglevel-plugin-prefix.min.js"></script>

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
var log = require('loglevel');
var prefix = require('loglevel-plugin-prefix');

prefix.apply(log, {
  template: '[%t] %l (%n) static text:',
  timestampFormatter: function (date) { return date.toISOString() },
  levelFormatter: function (level) { return level.charAt(0).toUpperCase() + level.substr(1) },
  nameFormatter: function (name) { return name || 'global' }
});

log.warn('prefixed message');
```

Output
```
[2017-05-29T12:53:46.000Z] Warn (global) static text: prefixed message
```

## Example

```javascript
// moduleA.js
var log = require('loglevel');

module.exports = function () {
  log.warn('message from moduleA');
}
```

```javascript
// moduleB.js
var log = require('loglevel');

var logger = log.getLogger('moduleB');

module.exports = function () {
  logger.warn('message from moduleB');
}
```

```javascript
// moduleC.js
var log = require('loglevel');

module.exports = function () {
  var logger = log.getLogger('moduleC');
  logger.warn('message from moduleC');
}
```

```javascript
// main.js
var log = require('loglevel');
var prefix = require('loglevel-plugin-prefix');

var a = require('./moduleA');
var b = require('./moduleB');
var c = require('./moduleC');

log.warn('message from root %s prefixing', 'before');

prefix.apply(log, { template: '[%t] %l (%n):' });

log.warn('message from root %s prefixing', 'after');

a();
b();
c();

prefix.apply(log, {
  template: '[%t] %l:',
  timestampFormatter: function (date) { return date.toISOString() }
});

log.warn('message from root after reapplying');
```

Output
```
message from root before prefixing
[16:53:46] WARN (root): message from root after prefixing
[16:53:46] WARN (root): message from moduleA
message from moduleB
[16:53:46] WARN (moduleC): message from moduleC
[2017-05-29T12:53:46.000Z] WARN: message from root after reapplying
```
