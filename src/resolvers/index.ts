import logger from "../loggers/winston"
import { fetchPageMetadata } from '../services/page_metadata_service';

import { getCachedPageMetadata, setCachedPageMetadata } from '../redis/page_metadata_storage';

export default {
  Query: {
    fetchPageMetadata: async (_, { domain }, __) => {

      let cachedMetadata = await getCachedPageMetadata(domain);
      if (cachedMetadata) {
        logger.debug(`Returned cached page metadata for domain ${domain}`);
        return cachedMetadata;
      }

      const metadata = await fetchPageMetadata(domain);
      await setCachedPageMetadata(domain, metadata);

      return metadata;
    }
  }
}
