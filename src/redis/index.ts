import * as Redis from 'ioredis';
import * as RedisLock from 'redis-lock';
import * as Utils from 'util';

const REDISTOGO_URL = process.env.REDISTOGO_URL || `localhost:6379`;

const redisClient = new Redis(REDISTOGO_URL);
const redisLock = Utils.promisify(new RedisLock(redisClient));

export {
  redisClient,
  redisLock
}
