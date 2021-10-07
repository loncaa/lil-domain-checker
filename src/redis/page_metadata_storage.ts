import logger from '../loggers/winston';
import { redisClient, redisLock } from './index';

const EXPIRES_IN = 60 * 30; // 30 minutes
const KEY = 'd:'
const LOCK_PREFIX = 'lock:'

function createRedisKey(domain) {
  return `${KEY}:${domain}`;
}

function createRedisLockKey(redisKey) {
  return `${LOCK_PREFIX}${redisKey}`;
}

export async function getCachedPageMetadata(domain) {
  const redisKey = createRedisKey(domain);

  try {
    const stringifiedMeta = await redisClient.get(redisKey);
    const meta = JSON.parse(stringifiedMeta);
    return meta;
  }
  catch (e) {
    logger.error(`Failed to fetch metadata. ${e.message}`);
  }

  return null;
}

export async function setCachedPageMetadata(domain, metadata) {
  const redisKey = createRedisKey(domain);
  const lockKey = createRedisLockKey(redisKey);
  const unlock = await redisLock(lockKey);

  const meta = await redisClient.get(KEY);
  if (meta) {
    unlock();
    return meta;
  }

  try {
    const stringifiedMeta = JSON.stringify(metadata);
    await redisClient.setex(redisKey, EXPIRES_IN, stringifiedMeta);
  }
  catch (e) {
    logger.error(`Failed to store metadata. ${e.message}`);
  }
  finally {
    unlock();
  }

  return metadata;
}
