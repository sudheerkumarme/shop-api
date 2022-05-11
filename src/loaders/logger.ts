import winston from 'winston';
import config from '@/config';
import appRoot from 'app-root-path';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console(options.console));
  transports.push(new winston.transports.File(options.file));
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
      ...options.console
    }),
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
export class LoggerStream {
  write(message: string) {
    // using the 'info' log level so the output will be picked up by both transports (file and console)
    LoggerInstance.info(`✌️ ${message.substring(0, message.lastIndexOf('\n'))}`);
  }
}

export default LoggerInstance;
