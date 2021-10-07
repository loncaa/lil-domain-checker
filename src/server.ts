import './env';
import * as express from 'express';
import * as helmet from 'helmet';
import * as xss from 'xss-clean';
import morgan from './loggers/morgan';
import logger from './loggers/winston';

import { createApolloServer } from './apollo.server';

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
  logger.info(`Express Server ready at http://localhost:${port}`)
});

const apolloServer = createApolloServer();
apolloServer.start().then(() => {
  logger.info(`🌚 Apollo Server ready at http://localhost:${port}/graphql!`);
  apolloServer.applyMiddleware({ app })
});

export { app };
