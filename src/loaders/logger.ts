import winston from 'winston';
import config from '@/config';

const fileTransport = new winston.transports.File({
  level: 'info',
  filename: `logs/app.log`,
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.printf((info) => {
      const { timestamp, level, message } = info;
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
});

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((info) => {
      const { timestamp, level, message } = info;
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
});

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'development') {
  LoggerInstance.add(fileTransport);
  LoggerInstance.add(consoleTransport);
} else {
  LoggerInstance.add(consoleTransport);
}

// create a stream object with a 'write' function that will be used by `morgan`
export class LoggerStream {
  write(message: string) {
    // using the 'info' log level so the output will be picked up by both transports (file and console)
    LoggerInstance.info(`✌️ ${message.substring(0, message.lastIndexOf('\n'))}`);
  }
}

export default LoggerInstance;
