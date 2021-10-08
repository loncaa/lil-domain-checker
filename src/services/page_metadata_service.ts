import * as normalizeUrl from 'normalize-url';
import { URL } from 'url';

import { createCheerioContent } from '../utils/cheerio_utils';
import { countScriptContentLinks, countCiteBasedLinks, countLongdescBasedLinks, countHrefBasedLinks, countSrcBasedLinks } from '../utils/link_utils';

async function getPageLinksCount($, protocol, domain) {
  const response = {
    domain,
    protocol,
    internalLinksCount: 0,
    externalLinksCount: 0,
    httpLinksCount: 0,
    httpsLinksCount: 0
  };

  countCiteBasedLinks($, response);
  countLongdescBasedLinks($, response);
  countHrefBasedLinks($, response);
  countSrcBasedLinks($, response);
  countScriptContentLinks($, response);

  return response;
}

export async function fetchPageMetadata(url) {
  const normalizedUrl = normalizeUrl(url);
  const $ = await createCheerioContent(normalizedUrl);

  const titleElement = $('head > title') || $('head > meta[property=og:title]');
  const descriptionElement = $('head > meta[name=description]') || $('head > meta[property=og:description]');

  const title = titleElement.text() || titleElement.attr('content');
  const description = descriptionElement.attr('content');

  const urlObject = new URL(normalizedUrl);
  const hostname = urlObject.hostname;
  const protocol = urlObject.protocol;

  const linksCount = await getPageLinksCount($, protocol, hostname);

  return {
    domain: hostname,
    title,
    description,
    ...linksCount
  }
}
