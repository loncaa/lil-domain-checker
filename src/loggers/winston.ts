import * as winston from 'winston';

const NODE_ENV = process.env['NODE_ENV'] || 'development';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const level = () => {
  const isDevelopment = NODE_ENV === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} : ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console()
];

export default winston.createLogger({
  level: level(),
  levels,
  format,
  transports
})
