# loglevel-prefix
Minimal, dependency-free and lightweight (0.9KB minified and gzipped) plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation && base usage

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

### Node && Bundlers (Webpack, Browserify)

Install package
```sh
npm install loglevel-prefix --save
```

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

AMD (RequireJS)
```javascript
define(['loglevel', 'loglevel-prefix'], function(log, prefix) {
  prefix(log);
  log.warn('prefixed message');
});
```

### Default options

```javascript
options = {
  format: '[%t] %l:',
  dateFormatter: date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
  levelFormatter: level => level => level.toUpperCase(),
  nameFormatter: name => name || 'root'
}
```

### Output

```
[12:53:46] WARN: prefixed message
```

## Example

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

### Output

```
[2017-05-29T16:53:46.000Z] Warn (global) <static>: prefixed message
```
