import logger from "../loggers/winston"
import { parseDomainMetaData, parseDomainLinks } from '../services/domain_service';

export default {
  DomainMetaData: {
    domainLinksInformation: async ({ $ }) => {
      const linkCountInformation = await parseDomainLinks($);
      return linkCountInformation;
    },
  },
  Query: {
    fetchDomainMetaData: async (_, { domain }, __) => {
      const response = await parseDomainMetaData(domain);
      return response;
    }
  }
}
