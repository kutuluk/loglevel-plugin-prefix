# loglevel-prefix
Plugin for [loglevel](https://github.com/pimterry/loglevel) message prefixing

## Installation

```sh
npm install --save loglevel-prefix
```

## Base usage

ES6
```javascript

import log from 'loglevel';
import prefix from 'loglevel-prefix';

prefix(log);

log.warn('prefixed message');

```
Output

```
[12:53:46] WARN: prefixed message
```
