let isAssigned = false;

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

const apply = function apply(logger, options) {
  if (!logger || !logger.getLogger) {
    throw new TypeError('Argument is not a root loglevel object');
  }

  if (isAssigned) {
    throw new TypeError('You can assign a prefix only one time');
  }

  isAssigned = true;

  options = merge({}, defaults, options);

  const originalFactory = logger.methodFactory;
  logger.methodFactory = function methodFactory(methodName, logLevel, loggerName) {
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

  logger.setLevel(logger.getLevel());
  return logger;
};

const prefix = {};
prefix.apply = apply;
prefix.name = 'loglevel-plugin-prefix';

const savePrefix = window ? window.prefix : undefined;
prefix.noConflict = () => {
  if (window && window.prefix === prefix) {
    window.prefix = savePrefix;
  }
  return prefix;
};

export default prefix;
