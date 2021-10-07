import { gql } from 'apollo-server-express';

const domainCheck = gql`
  type PageMetaData {
    domain: String!
    title: String!
    description: String
    internalLinksCount: Int!
    externalLinksCount: Int!
    httpsLinksCount: Int!
    httpLinksCount: Int!
  }

  type Query {
    fetchPageMetaData(domain: String): PageMetaData!
  }
`;

export default [
  domainCheck
]
