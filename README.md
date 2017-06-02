# loglevel-prefix
Minimal lightweight (0.9KB minified and gzipped) plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation

```sh
npm install loglevel-prefix --save
```

## API

```javascript
prefix(log[, options]);
```

**log** - root logger, imported from loglevel package

**options** - configuration object

```javascript
default_options = {
  template: '[%t] %l:',
  timestampFormatter: date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
  levelFormatter: level => level.toUpperCase(),
  nameFormatter: name => name || 'root'
}
```

Plugin formats the prefix using **template** option as a printf-like format.

The **template** is a string containing zero or more placeholder tokens. Each placeholder token is replaced with the value from loglevel messages parameters. Supported placeholders are:

%t - Timestamp of message.

%l - Level of message.

%n - Name of logger.

The **timestampFormatter**, **levelFormatter** and **nameFormatter** is a functions for formatting corresponding values

## Base usage

### Browser directly

Download [production version](https://raw.githubusercontent.com/kutuluk/loglevel-prefix/master/dist/loglevel-prefix.min.js)
and copy to your project folder
```html
<script src="loglevel.min.js"></script>
<script src="loglevel-prefix.min.js"></script>

<script>
  prefix(log);
  log.warn('prefixed message');
</script>
```

Output
```
[12:53:46] WARN: prefixed message
```

### ES6
```javascript

import log from 'loglevel';
import prefix from 'loglevel-prefix';

prefix(log);
log.warn('prefixed message');
```

### CommonJS
```javascript

var log = require('loglevel');
var prefix = require('loglevel-prefix');
prefix(log);

// or
// var log = require('loglevel-prefix')(require('loglevel'));

log.warn('prefixed message');
```

### AMD
```javascript
define(['loglevel', 'loglevel-prefix'], function(log, prefix) {
  prefix(log);
  log.warn('prefixed message');
});
```

## Custom options

```javascript
import log from 'loglevel';
import prefix from 'loglevel-prefix';

prefix(log, {
  template: '[%t] %l (%n) static text:',
  timestampFormatter: date => date.toISOString(),
  levelFormatter: level => level.charAt(0).toUpperCase() + level.substr(1),
  nameFormatter: name => name || 'global'
});

log.warn('prefixed message');
```

Output
```
[2017-05-29T16:53:46.000Z] Warn (global) static text: prefixed message
```

## Example

```javascript
// moduleA.js
import log from 'loglevel';

export default function () {
  log.warn('message from moduleA');
}
```

```javascript
// moduleB.js
import log from 'loglevel';

const logger = log.getLogger('moduleB');

export default function () {
  logger.warn('message from moduleB');
}
```

```javascript
// moduleC.js
import log from 'loglevel';

export default function () {
  const logger = log.getLogger('moduleC');
  logger.warn('message from moduleC');
}
```

```javascript
// main.js
import log from 'loglevel';
import prefix from 'loglevel-prefix';

import a from './moduleA';
import b from './moduleB';
import c from './moduleC';

log.warn('message from root %s prefixing', 'before');

prefix(log, {
  template: '[%t] %l (%n):',
});

log.warn('message from root %s prefixing', 'after');

a();
b();
c();
```

Output
```
message from root before prefixing
[16:53:46] WARN (root): message from root after prefixing
[16:53:46] WARN (root): message from moduleA
message from moduleB
[16:53:46] WARN (moduleC): message from moduleC
```

## Errors

```javascript
// main.js
import log from 'loglevel';
import prefix from 'loglevel-prefix';

log.setLevel('info');
prefix(log);

log.info('message from root after prefixing');

try {
  prefix(log, {
    timestampFormatter: date => date.toISOString()
  });
} catch(e) {
  log.error(e);
};

log.info('message from root after pre-prefixing');

const logger = log.getLogger('main');

try {
  prefix(logger, {
    template: '[%t] %l (%n):'
  });
} catch(e) {
  logger.error(e);
};

logger.info('message from child logger');
```

Output
```
[16:53:46] INFO: message from root after prefixing
[16:53:46] ERROR: TypeError: You can assign a prefix only one time
[16:53:46] INFO: message from root after pre-prefixing
[16:53:46] ERROR: TypeError: Argument is not a root loglevel object
[16:53:46] INFO: message from child logger
```
