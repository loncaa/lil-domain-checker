import * as Redis from 'ioredis';
import * as RedisLock from 'redis-lock';
import * as Utils from 'util';

import logger from '../loggers/winston';

const REDISTOGO_URL = process.env.REDISTOGO_URL || `localhost:6379`;

const redisClient = new Redis(REDISTOGO_URL);
const redisLock = Utils.promisify(new RedisLock(redisClient));

redisClient.on('connect', () => {
  logger.info('Successfully connected to Redis!');
});

redisClient.on('error', (error) => {
  logger.error(`Error occurred while connecting to Redis. ${error}`);
});

export {
  redisClient,
  redisLock
}
