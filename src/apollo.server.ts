import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema'
import logger from './loggers/winston';

import typeDefs from './schemas';
import resolvers from './resolvers';

import { errorLoggingMiddleware } from './apollo_plugins';

export function createApolloServer() {
  const schema = makeExecutableSchema({
    typeDefs: [...typeDefs],
    resolvers,
  });

  const apolloServer = new ApolloServer({
    plugins: [
      {
        async serverWillStart() {
          logger.info('Apollo Server starting up!');
        },
      },
      errorLoggingMiddleware
    ],
    introspection: true,
    schema,
    formatError: error => {
      logger.error(error.message);
      return error;
    },
    context: async ({ req }) => {
      if (req) {
        return {};
      }
    },
  });

  return apolloServer;
};
