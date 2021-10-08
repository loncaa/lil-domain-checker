//import normalizeUrl from 'normalize-url';

//source of elements with links: https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
const HREF_ELEMENT_TAGS = 'link[href], a[href], area[href], base[href]';
const CITE_ELEMENT_TAGS = 'blockquote[cite], del[cite], ins[cite], q[cite]';
const LONGDESC_ELEMENT_TAGS = 'frame[longdesc], iframe[longdesc], img[longdesc]';
const SRC_ELEMENT_TAGS = 'script[src], iframe[src], img[src], input[src], audio[src], embed[src], source[src], track[src], video[src]';

function countUrls(url, response) {
  const normalizedUrl = url; //normalizeUrl(url);

  if (normalizedUrl.startsWith('/') || url.includes(response.domain)) {
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

function parseElementsAndCount(elements, cheerioContent, payloadStorage, attr) {
  elements.each((i, elm) => {
    const url = cheerioContent(elm).attr(attr);
    countUrls(url, payloadStorage);
  });

  return payloadStorage;
}

export function fetchAndCountHrefBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(HREF_ELEMENT_TAGS);
  return parseElementsAndCount(elements, cheerioContent, payloadStorage, 'href');
}

export function fetchAndCountCiteBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(CITE_ELEMENT_TAGS);
  return parseElementsAndCount(elements, cheerioContent, payloadStorage, 'cite');
}

export function fetchAndCountLongdescBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(LONGDESC_ELEMENT_TAGS);
  return parseElementsAndCount(elements, cheerioContent, payloadStorage, 'longdesc');
}

export function fetchAndCountSrcBasedLinks(cheerioContent, payloadStorage) {
  const elements = cheerioContent(SRC_ELEMENT_TAGS);
  return parseElementsAndCount(elements, cheerioContent, payloadStorage, 'src');
}

export function fetchAndCountScriptContentLinks(cheerioContent, payloadStorage) {
  const scripts = cheerioContent('script');
  scripts.each((i, elm) => {
    const text = cheerioContent(elm).text();
    if (text && text !== "") {

    }
  })
}
