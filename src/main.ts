import './env';
import * as express from 'express';
import * as helmet from 'helmet';
import * as jwt from 'jsonwebtoken';
import * as xss from 'xss-clean';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema'

import morgan from './loggers/morgan';
import logger from './loggers/winston';

import typeDefs from './schemas';
import resolvers from './resolvers';

const port = process.env['PORT'];

const app = express();
app.use(morgan);
app.use(express.json({ limit: '20mb' }));

app.use(helmet());
app.use(xss());

app.get('/', async function (req, res) {
  res.json({});
});

app.listen(port, async () => {
  logger.info(`🚀 Server ready at http://localhost:${port}`)
});

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

async function startApolloServer(){
  const schema = makeExecutableSchema({
    typeDefs: [...typeDefs],
    resolvers,
  });

  const apolloServer = new ApolloServer({
    plugins: [
      {
        async serverWillStart() {
          logger.debug('Server starting up!');
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

  await apolloServer.start();
  await apolloServer.applyMiddleware({ app });
}

startApolloServer();

export { app };
