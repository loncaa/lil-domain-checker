import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

export async function createCheerioContent(normalizedUrl){
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(normalizedUrl);

  const content = await page.content();

  await browser.close();

  return cheerio.load(content);
}
