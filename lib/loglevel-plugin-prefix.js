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
  var merge = function merge(target) {
    for (var i = 1; i < arguments.length; i += 1) {
      for (var prop in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], prop)) {
          target[prop] = arguments[i][prop];
        }
      }
    }
    return target;
  };

  var defaults = {
    template: '[%t] %l:',
    timestampFormatter: function timestampFormatter(date) {
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    },
    levelFormatter: function levelFormatter(level) {
      return level.toUpperCase();
    },
    nameFormatter: function nameFormatter(name) {
      return name || 'root';
    }
  };

  var loglevel = void 0;
  var originalFactory = void 0;
  var pluginFactory = void 0;

  var apply = function apply(logger, options) {
    if (!logger || !logger.getLogger) {
      throw new TypeError('Argument is not a root loglevel object');
    }

    if (loglevel && pluginFactory !== logger.methodFactory) {
      throw new Error("You can't reassign a plugin after appling another plugin");
    }

    loglevel = logger;

    options = merge({}, defaults, options);

    originalFactory = originalFactory || logger.methodFactory;

    pluginFactory = function methodFactory(methodName, logLevel, loggerName) {
      var rawMethod = originalFactory(methodName, logLevel, loggerName);

      var hasTimestamp = options.template.indexOf('%t') !== -1;
      var hasLevel = options.template.indexOf('%l') !== -1;
      var hasName = options.template.indexOf('%n') !== -1;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var content = options.template;
        if (hasTimestamp) content = content.replace(/%t/, options.timestampFormatter(new Date()));
        if (hasLevel) content = content.replace(/%l/, options.levelFormatter(methodName));
        if (hasName) content = content.replace(/%n/, options.nameFormatter(loggerName));

        if (args.length && typeof args[0] === 'string') {
          // concat prefix with first argument to support string substitutions
          args[0] = content + ' ' + args[0];
        } else {
          args.unshift(content);
        }
        rawMethod.apply(undefined, args);
      };
    };

    logger.methodFactory = pluginFactory;
    logger.setLevel(logger.getLevel());
    return logger;
  };

  var disable = function disable() {
    if (!loglevel) {
      throw new Error("You can't disable a not appled plugin");
    }

    if (pluginFactory !== loglevel.methodFactory) {
      throw new Error("You can't disable a plugin after appling another plugin");
    }

    loglevel.methodFactory = originalFactory;
    loglevel.setLevel(loglevel.getLevel());
    originalFactory = undefined;
    loglevel = undefined;
  };

  var prefix = {};
  prefix.apply = apply;
  prefix.disable = disable;

  var save = typeof window !== 'undefined' ? window.prefix : undefined;

  prefix.noConflict = function () {
    if (typeof window !== 'undefined' && window.prefix === prefix) {
      window.prefix = save;
    }
    return prefix;
  };

  exports.default = prefix;
  module.exports = exports['default'];
});
