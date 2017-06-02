let isAssigned = false;

const prefix = function prefix(logger, options) {
  if (!logger || !logger.getLogger) {
    throw new TypeError('Argument is not a root loglevel object');
  }

  if (isAssigned) {
    throw new TypeError('You can assign a prefix only one time');
  }

  isAssigned = true;

  options = options || {};
  options.template = options.template || '[%t] %l:';
  options.timestampFormatter =
    options.timestampFormatter ||
    (date => date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1'));
  options.levelFormatter = options.levelFormatter || (level => level.toUpperCase());
  options.nameFormatter = options.nameFormatter || (name => name || 'root');

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

export default prefix;
