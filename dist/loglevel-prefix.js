(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.prefix = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isPrefixed = false;

  var prefix = function prefix(logger, options) {
    if (!logger || !logger.getLogger) {
      throw new TypeError('Argument is not a root loglevel object');
    }

    if (isPrefixed) {
      throw new TypeError('You can assign a prefix only one time');
    }

    isPrefixed = true;

    options = options || {};
    options.format = options.format || '[%t] %l:';
    options.timestampFormatter = options.timestampFormatter || function (date) {
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    };
    options.levelFormatter = options.levelFormatter || function (level) {
      return level.toUpperCase();
    };
    options.nameFormatter = options.nameFormatter || function (name) {
      return name || 'root';
    };

    var originalFactory = logger.methodFactory;
    logger.methodFactory = function methodFactory(methodName, logLevel, loggerName) {
      var rawMethod = originalFactory(methodName, logLevel, loggerName);

      var hasTimestamp = options.format.indexOf('%t') !== -1;
      var hasLevel = options.format.indexOf('%l') !== -1;
      var hasName = options.format.indexOf('%n') !== -1;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var content = options.format;
        if (hasTimestamp) content = content.replace(/%t/, options.timestampFormatter(new Date()));
        if (hasLevel) content = content.replace(/%l/, options.levelFormatter(methodName));
        if (hasName) content = content.replace(/%n/, options.nameFormatter(loggerName));

        args.unshift(content);
        rawMethod.apply(undefined, args);
      };
    };

    logger.setLevel(logger.getLevel());
    return logger;
  };

  exports.default = prefix;
  module.exports = exports['default'];
});
