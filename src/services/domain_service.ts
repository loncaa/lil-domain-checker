import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

import { fetchAndCountCiteBasedLinks, fetchAndCountLongdescBasedLinks, fetchAndCountHrefBasedLinks, fetchAndCountSrcBasedLinks} from '../utils/link_utils';

async function fetchPageLinksCount($, domain){
  const response = {
    domain,
    internalLinksCount: 0,
    externalLinksCount: 0,
    httpLinksCount: 0,
    httpsLinksCount: 0
  };

  fetchAndCountCiteBasedLinks($, response);
  fetchAndCountLongdescBasedLinks($, response);
  fetchAndCountHrefBasedLinks($, response);
  fetchAndCountSrcBasedLinks($, response);

  return response;
}

export async function fetchPageMetaData(domain) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(domain);

  const content = await page.content();
  const $ = cheerio.load(content);

  await browser.close()

  const titleElement = $('head > title') || $('head > meta[property=og:title]');
  const descriptionElement = $('head > meta[name=description]') || $('head > meta[property=og:description]');

  const title = titleElement.text() || titleElement.attr('content');
  const description = descriptionElement.attr('content');
  const linksCount = await fetchPageLinksCount($, domain);

  return {
    domain,
    title,
    description,
    ...linksCount
  }
}
