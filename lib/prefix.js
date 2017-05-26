let isGlobal;

const prefix = function prefix(logger, options) {
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
  options.timestampFormatter =
    options.timestampFormatter ||
    (() => new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'));
  options.levelFormatter = options.levelFormatter || (level => level.toUpperCase());
  options.nameFormatter = options.nameFormatter || (name => name || 'root');

  const originalFactory = logger.methodFactory;
  logger.methodFactory = function methodFactory(methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    const hasTimestamp = !(options.format.indexOf('%t') === -1);
    const hasLevel = !(options.format.indexOf('%l') === -1);
    const hasName = !(options.format.indexOf('%n') === -1);

    const empty = () => '';
    const printTimestamp = hasTimestamp ? () => options.timestampFormatter() : empty;
    const printLevel = hasLevel ? () => options.levelFormatter(methodName) : empty;
    const printName = hasName ? () => options.nameFormatter(loggerName) : empty;

    return (...args) => {
      let content = options.format;
      if (hasTimestamp) content = content.replace(/%t/, printTimestamp());
      if (hasLevel) content = content.replace(/%l/, printLevel());
      if (hasName) content = content.replace(/%n/, printName());
      args.unshift(content);
      rawMethod.apply(this, args);
    };
  };

  logger.setLevel(logger.getLevel());
  return logger;
};

export default prefix;
