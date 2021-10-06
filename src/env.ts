import * as dotenv from 'dotenv';
import logger from './loggers/winston';

var env = process.env['NODE_ENV'] || 'development';
if (env === 'development') {
  logger.debug('Development environment variables loaded.');
  dotenv.config();
}
