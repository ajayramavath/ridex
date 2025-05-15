import winston from 'winston';

const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  )
});

logger.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

logger.on('error', (err) => {
  console.error('🔥 Winston encountered an error:', err);
});

const stream = {
  write: (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      logger.info(trimmedMessage);
    }
  },
};

export { logger, stream };