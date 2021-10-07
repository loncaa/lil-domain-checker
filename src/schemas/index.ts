import { gql } from 'apollo-server-express';

const domainCheck = gql`
  type PageMetadata {
    domain: String!
    title: String!
    description: String
    internalLinksCount: Int!
    externalLinksCount: Int!
    httpsLinksCount: Int!
    httpLinksCount: Int!
  }

  type Query {
    fetchPageMetadata(domain: String): PageMetadata!
  }
`;

export default [
  domainCheck
]
