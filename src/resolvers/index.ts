import logger from "../loggers/winston"
import { fetchPageMetaData } from '../services/domain_service';

import { getCachedPageMetadata, setCachedPageMetadata } from '../redis/page_metadata_storage';

export default {
  Query: {
    fetchPageMetaData: async (_, { domain }, __) => {

      let cachedMetadata = await getCachedPageMetadata(domain);
      if (cachedMetadata) {
        logger.debug(`Returned cached page metadata for domain ${domain}`);
        return cachedMetadata;
      }

      const metadata = await fetchPageMetaData(domain);
      await setCachedPageMetadata(domain, metadata);

      return metadata;
    }
  }
}
