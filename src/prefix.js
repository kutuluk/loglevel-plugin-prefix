const merge = function merge(target) {
  for (let i = 1; i < arguments.length; i += 1) {
    for (const prop in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], prop)) {
        target[prop] = arguments[i][prop];
      }
    }
  }
  return target;
};

const defaults = {
  template: '[%t] %l:',
  timestampFormatter: date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
  levelFormatter: level => level.toUpperCase(),
  nameFormatter: name => name || 'root',
};

let loglevel;
let originalFactory;
let pluginFactory;

const apply = function apply(logger, options) {
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
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    const hasTimestamp = options.template.indexOf('%t') !== -1;
    const hasLevel = options.template.indexOf('%l') !== -1;
    const hasName = options.template.indexOf('%n') !== -1;

    return (...args) => {
      let content = options.template;
      if (hasTimestamp) content = content.replace(/%t/, options.timestampFormatter(new Date()));
      if (hasLevel) content = content.replace(/%l/, options.levelFormatter(methodName));
      if (hasName) content = content.replace(/%n/, options.nameFormatter(loggerName));

      if (args.length && typeof args[0] === 'string') {
        // concat prefix with first argument to support string substitutions
        args[0] = `${content} ${args[0]}`;
      } else {
        args.unshift(content);
      }
      rawMethod(...args);
    };
  };

  logger.methodFactory = pluginFactory;
  logger.setLevel(logger.getLevel());
  return logger;
};

const disable = function disable() {
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

const prefix = {};
prefix.apply = apply;
prefix.disable = disable;

const save = typeof window !== 'undefined' ? window.prefix : undefined;

prefix.noConflict = () => {
  if (typeof window !== 'undefined' && window.prefix === prefix) {
    window.prefix = save;
  }
  return prefix;
};

export default prefix;
