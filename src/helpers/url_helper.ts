import * as normalizeUrl from 'normalize-url';
import logger from '../loggers/winston';

export function detectURLs(script) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return script.match(urlRegex)
}

export function normalizePageUrl(protocol, domain, url) {
  let normalizedUrl = null

  try {
    if (url.startsWith('/')) {
      normalizedUrl = normalizeUrl(`${protocol}//${domain}${url}`);
    }else{
      normalizedUrl = normalizeUrl(url);
    }
  } catch (e) {
    logger.error(`Failed to normalize url: ${url}`)
  }

  return normalizedUrl;
}
