import logger from "../loggers/winston"
import { parseDomainMetaData, parseDomainLinks } from '../services/domain_check_service';

export default {
  DomainMetaData: {
    domainLinksInformation: async ({ $, domain }) => {
      const linkCountInformation = await parseDomainLinks($, domain);
      return linkCountInformation;
    },
  },
  Query: {
    fetchDomainMetaData: async (_, {domain}, __) => {
      const response = await parseDomainMetaData(domain);
      return response;
    }
  }
}
