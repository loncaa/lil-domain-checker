import { gql } from 'apollo-server-express';

const main = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

const test = gql`
  extend type Query {
    ping: String!
  }
`;

export default [
  main,
  test
]
