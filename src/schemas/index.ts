import { gql } from 'apollo-server-express';

const domainCheck = gql`
  type DomainLinksInformation {
    internalLinksCount: Int!
    externalLinksCount: Int!
    httpsLinksCount: Int!
    httpLinksCount: Int!
  }

  type DomainMetaData {
    domain: String
    title: String!
    description: String!
    domainLinksInformation: DomainLinksInformation
  }

  type Query {
    fetchDomainMetaData(domain: String): DomainMetaData!
  }
`;

export default [
  domainCheck
]
