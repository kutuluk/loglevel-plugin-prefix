let isRoot;

const prefix = function prefix(logger, options) {
  if (!logger || !logger.methodFactory) {
    throw new TypeError('Argument is not a loglevel object');
  }

  isRoot = isRoot || !!(logger.getLogger);
  if (logger.getLogger) {
    if (!isRoot) {
      throw new TypeError('You can assign a prefix only to child loggers');
    }
  } else if (isRoot) {
    throw new TypeError('You can assign a prefix only to the root logger');
  }

  options = options || {};
  options.format = options.format || '[%t] %l:';
  options.timestampFormatter =
    options.timestampFormatter ||
    (date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'));
  options.levelFormatter = options.levelFormatter || (level => level.toUpperCase());
  options.nameFormatter = options.nameFormatter || (name => name || 'root');

  const originalFactory = logger.methodFactory;
  logger.methodFactory = function methodFactory(methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    const hasTimestamp = options.format.indexOf('%t') !== -1;
    const hasLevel = options.format.indexOf('%l') !== -1;
    const hasName = options.format.indexOf('%n') !== -1;

    return (...args) => {
      let content = options.format;
      if (hasTimestamp) content = content.replace(/%t/, options.timestampFormatter(new Date()));
      if (hasLevel) content = content.replace(/%l/, options.levelFormatter(methodName));
      if (hasName) content = content.replace(/%n/, options.nameFormatter(loggerName));

      args.unshift(content);
      rawMethod(...args);
    };
  };

  logger.setLevel(logger.getLevel());
  return logger;
};

export default prefix;
