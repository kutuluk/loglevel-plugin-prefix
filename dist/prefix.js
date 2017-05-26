(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.prefix = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isGlobal = void 0;

  var prefix = function prefix(logger, options) {
    if (typeof logger.methodFactory !== 'function') {
      throw new TypeError('Argument is not a loglevel object');
    }

    isGlobal = isGlobal === undefined ? typeof logger.getLogger === 'function' : isGlobal;
    if (typeof logger.getLogger === 'function') {
      if (!isGlobal) {
        throw new TypeError('You can assign a prefix only to child loggers');
      }
    } else if (isGlobal) {
      throw new TypeError('You can assign a prefix only to the root logger');
    }

    options = options || {};
    options.format = options.format || '[%t] %l:';
    options.timestampFormatter = options.timestampFormatter || function () {
      return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    };
    options.levelFormatter = options.levelFormatter || function (level) {
      return level.toUpperCase();
    };
    options.nameFormatter = options.nameFormatter || function (name) {
      return name || 'root';
    };

    var originalFactory = logger.methodFactory;
    logger.methodFactory = function methodFactory(methodName, logLevel, loggerName) {
      var _this = this;

      var rawMethod = originalFactory(methodName, logLevel, loggerName);

      var hasTimestamp = !(options.format.indexOf('%t') === -1);
      var hasLevel = !(options.format.indexOf('%l') === -1);
      var hasName = !(options.format.indexOf('%n') === -1);

      var empty = function empty() {
        return '';
      };
      var printTimestamp = hasTimestamp ? function () {
        return options.timestampFormatter();
      } : empty;
      var printLevel = hasLevel ? function () {
        return options.levelFormatter(methodName);
      } : empty;
      var printName = hasName ? function () {
        return options.nameFormatter(loggerName);
      } : empty;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var content = options.format;
        if (hasTimestamp) content = content.replace(/%t/, printTimestamp());
        if (hasLevel) content = content.replace(/%l/, printLevel());
        if (hasName) content = content.replace(/%n/, printName());
        args.unshift(content);
        rawMethod.apply(_this, args);
      };
    };

    logger.setLevel(logger.getLevel());
    return logger;
  };

  exports.default = prefix;
});
