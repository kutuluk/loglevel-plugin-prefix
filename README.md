# loglevel-prefix
Plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation and base usage

Browser
```html
<!-- Download production version from
     https://raw.githubusercontent.com/kutuluk/loglevel-prefix/master/dist/loglevel-prefix.min.js
-->

<script src="loglevel.min.js"></script>
<script src="loglevel-prefix.min.js"></script>

<script>
  prefix(log);
  log.warn('prefixed message');
</script>
```

Bundlers (Webpack, Browserify)

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

CommonJS (Node)
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

Output

```
[12:53:46] WARN: prefixed message
```
