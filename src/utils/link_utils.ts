import { normalizePageUrl, detectURLs} from '../helpers/url_helper';

//source of elements with links: https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
const HREF_ELEMENT_TAGS = 'link[href], a[href], area[href], base[href]';
const CITE_ELEMENT_TAGS = 'blockquote[cite], del[cite], ins[cite], q[cite]';
const LONGDESC_ELEMENT_TAGS = 'frame[longdesc], iframe[longdesc], img[longdesc]';
const SRC_ELEMENT_TAGS = 'script[src], iframe[src], img[src], input[src], audio[src], embed[src], source[src], track[src], video[src]';

function countDomainUrlProperties(url, response) {
  const { domain, protocol } = response;

  let normalizedUrl = normalizePageUrl(protocol, domain, url);
  if (!normalizedUrl) {
    return
  }

  if (normalizedUrl.includes(domain)) {
    response.internalLinksCount++;
  }
  else {
    response.externalLinksCount++;
  }

  if (normalizedUrl.includes('https')) {
    response.httpsLinksCount++;
  } else if (normalizedUrl.includes('http')) {
    response.httpLinksCount++;
  }
}

function passThroughElementsAndCount(elements, cheerioContent, payloadStorage, attr) {
  elements.each((i, elm) => {
    const url = cheerioContent(elm).attr(attr);
    countDomainUrlProperties(url, payloadStorage);
  });

  return payloadStorage;
}

export function countHrefBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(HREF_ELEMENT_TAGS);
  return passThroughElementsAndCount(elements, cheerioContent, payloadStorage, 'href');
}

export function countCiteBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(CITE_ELEMENT_TAGS);
  return passThroughElementsAndCount(elements, cheerioContent, payloadStorage, 'cite');
}

export function countLongdescBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(LONGDESC_ELEMENT_TAGS);
  return passThroughElementsAndCount(elements, cheerioContent, payloadStorage, 'longdesc');
}

export function countSrcBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(SRC_ELEMENT_TAGS);
  return passThroughElementsAndCount(elements, cheerioContent, payloadStorage, 'src');
}

export function countScriptContentLinks(cheerioContent, payloadStorage) {
  const scripts = cheerioContent('script');
  scripts.each((i, elm) => {
    const text = cheerioContent(elm).text();
    if (text && text !== "") {
      const urls = detectURLs(text);
      urls.forEach(url => {
        countDomainUrlProperties(url, payloadStorage);
      });
    }
  })
}
