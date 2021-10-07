import * as Redis from 'ioredis';
import * as RedisLock from 'redis-lock';
import * as Utils from 'util';

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = new Redis(REDIS_PORT, 'redis');
const redisLock = Utils.promisify(new RedisLock(redisClient));

export {
  redisClient,
  redisLock
}
