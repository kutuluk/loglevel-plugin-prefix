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

**log** - root logger, imported from loglevel package

**options** - configuration object

```javascript
var defaults = {
  template: '[%t] %l:',
  timestampFormatter: date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
  levelFormatter: level => level.toUpperCase(),
  nameFormatter: name => name || 'root'
}
```

Plugin formats the prefix using **template** option as a printf-like format.

The **template** is a string containing zero or more placeholder tokens. Each placeholder token is replaced with the value from loglevel messages parameters. Supported placeholders are:

- %t - timestamp of message
- %l - level of message
- %n - name of logger

The **timestampFormatter**, **levelFormatter** and **nameFormatter** is a functions for formatting corresponding values

## Base usage

### Browser directly

Download [production version](https://raw.githubusercontent.com/kutuluk/loglevel-plugin-prefix/master/dist/loglevel-plugin-prefix.min.js)
and copy to your project folder
```html
<script src="loglevel.min.js"></script>
<script src="loglevel-plugin-prefix.min.js"></script>

<script>
  var logger = log.noConflict();
  prefix.noConflict().apply(logger);
  logger.warn('prefixed message');
</script>
```

Output
```
[12:53:46] WARN: prefixed message
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

prefix.apply(log, {
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
import prefix from 'loglevel-plugin-prefix';

import a from './moduleA';
import b from './moduleB';
import c from './moduleC';

log.warn('message from root %s prefixing', 'before');

prefix.apply(log, {
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
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

log.setLevel('info');
prefix.apply(log);

log.info('message from root after prefixing');

try {
  prefix.apply(log, { timestampFormatter: date => date.toISOString() });
} catch(e) {
  log.error(e);
};

log.info('message from root after pre-prefixing');

const logger = log.getLogger('child');

try {
  prefix.apply(logger, { template: '[%t] %l (%n):' });
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
