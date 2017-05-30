# loglevel-prefix
Minimal, dependency-free and lightweight (0.9KB minified and gzipped) plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation

```sh
npm install loglevel-prefix --save
```

## API

```javascript
prefix(loglevel[, options]);
```

## Base usage

ES6
```javascript

import log from 'loglevel';
import prefix from 'loglevel-prefix';

prefix(log);
log.warn('prefixed message');

```

CommonJS
```javascript

var log = require('loglevel');
var prefix = require('loglevel-prefix');
prefix(log);

// or
// var log = require('loglevel-prefix')(require('loglevel'));

log.warn('prefixed message');

```

AMD
```javascript
define(['loglevel', 'loglevel-prefix'], function(log, prefix) {
  prefix(log);
  log.warn('prefixed message');
});
```

## Browser directly

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

## Options

### Default options
```javascript
options = {
  format: '[%t] %l:',
  dateFormatter: date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
  levelFormatter: level => level => level.toUpperCase(),
  nameFormatter: name => name || 'root'
}
```

Output
```
[12:53:46] WARN: prefixed message
```

### Custom options
```javascript
import log from 'loglevel';
import prefix from 'loglevel-prefix';

prefix(log, {
  format: '[%t] %l (%n) <static>:',
  dateFormatter: date => date.toISOString(),
  levelFormatter: level => level.charAt(0).toUpperCase() + level.substr(1),
  nameFormatter: name => name || 'global'
});

log.warn('prefixed message');
```

Output
```
[2017-05-29T16:53:46.000Z] Warn (global) <static>: prefixed message
```

## Root loglevel prefixing

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

export default function () {
  log.getLogger('moduleB').warn('message from moduleB');
}
```

```javascript
// moduleC.js
import log from 'loglevel';
import prefix from 'loglevel-prefix';

export default function () {
  prefix(log, {
    format: '[%t] %l (%n) <moduleC>:',
  });
  log.warn('message from moduleC');
}
```

```javascript
// main.js
import log from 'loglevel';
import prefix from 'loglevel-prefix';

import a from './moduleA';
import b from './moduleB';
import c from './moduleC';

prefix(log, {
  format: '[%t] %l (%n):',
});

log.warn('message from root');
a();
b();
c();
```

Output
```
[16:53:46] WARN (root): message from root
[16:53:46] WARN (root): message from moduleA
[16:53:46] WARN (moduleB): message from moduleB
Uncaught TypeError: You can assign a prefix only to the root logger
```

## loglevel.getLogger() prefixing

```javascript
// moduleA.js
import loglevel from 'loglevel';
import prefix from 'loglevel-prefix';

const log = prefix(loglevel.getLogger('moduleA'), {
  format: '[%t] %l (%n):',
  dateFormatter: date => date.toISOString()
});

log.warn('message from moduleA');
```

```javascript
// moduleB.js
import loglevel from 'loglevel';
import prefix from 'loglevel-prefix';

const log = prefix(loglevel.getLogger('moduleB'), {
  format: '[%t] %l (%n):',
  dateFormatter: date => date.toISOString()
});

log.warn('message from moduleB');
```

```javascript
// moduleC.js
import log from 'loglevel';

log.warn('message from moduleС');
```

```javascript
// main.js
import loglevel from 'loglevel';
import prefix from 'loglevel-prefix';

import './moduleA';
import './moduleB';
import './moduleC';

loglevel.warn('message from root');

const log = prefix(loglevel.getLogger('main'), {
  format: '[%t] %l (%n):',
  dateFormatter: date => date.toISOString()
});
log.warn('message from main');

prefix(loglevel, {
  format: '[%t] %l (%n):',
});

loglevel.warn('message from prefixed root');
```

Output
```
[2017-05-29T16:53:46.000Z] WARN (moduleA): message from moduleA
[2017-05-29T16:53:46.000Z] WARN (moduleB): message from moduleB
[16:53:46] WARN: message from moduleС
[16:53:46] WARN: message from root
[2017-05-29T16:53:46.000Z] WARN (main): message from main
Uncaught TypeError: You can assign a prefix only to child loggers
```
