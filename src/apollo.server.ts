import * as jwt from 'jsonwebtoken';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema'
import logger from './loggers/winston';

import typeDefs from './schemas';
import resolvers from './resolvers';

const errorLoggingMiddleware = {
  async requestDidStart(requestContext) {
    return {
      async didEncounterErrors(context) {

        if (process.env['LOG_FAILED_REQUESTS']) {
          logger.info(requestContext.request.query);

          context.errors.forEach(err => {
            logger.error(err.message);
          });
        }
      }
    }
  },
};

export const getTokenData = async (token: string) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again. ' + e.message + ' ' + token + '/// ' + process.env.SECRET,
      );
    }
  }
};

export function createApolloServer(){
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
        const token = req.headers['x-token'] as string;
        const data = await getTokenData(token);

        return { ...data };
      }
    },
  });

  return apolloServer;
};
