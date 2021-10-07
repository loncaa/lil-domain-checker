import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import loggers from '../loggers/winston';

export async function parseDomainLinks($, domain){
  const externalLinks = [];
  const internalLinks = [];

  let httpLinksCount = 0;
  let httpsLinksCount = 0;

  function pushToLinksArray(elm, attr){
    const link = $(elm).attr(attr);
    if(link.startsWith('/') || link.includes(domain)){
      internalLinks.push(link);
    }
    else{
      externalLinks.push(link);
    }

    if(link.includes('https')){
      httpsLinksCount++;
    }else if(link.includes('http')){
      httpLinksCount++;
    }
  }

  $('link[href], a[href]').each((i, elm) => { pushToLinksArray(elm, 'href') });
  $('script[src]').each((i, elm) => { pushToLinksArray(elm, 'src') });

  return {
    internalLinksCount: internalLinks.length,
    externalLinksCount: externalLinks.length,
    httpLinksCount,
    httpsLinksCount,
  }
}

export async function parseDomainMetaData(domain) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(domain);

  const content = await page.content();
  const $ = cheerio.load(content);

  const titleElement = $('head > title') || $('head > meta[property=og:title]');
  const descriptionElement = $('head > meta[name=description]') || $('head > meta[property=og:description]');

  const title = titleElement.text() || titleElement.attr('content');
  const description = descriptionElement.attr('content');

  return {
    domain,
    title,
    description,
    $,
  }
}
