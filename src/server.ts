import './env';
import * as express from 'express';
import * as helmet from 'helmet';
import * as xss from 'xss-clean';
import * as cors from 'cors';
import morgan from './loggers/morgan';
import logger from './loggers/winston';

import { createApolloServer } from './apollo.server';
import path = require('path');

const port = process.env['PORT'];

const app = express();
app.use(morgan);
app.use(express.json({ limit: '20mb' }));

app.use(helmet());
app.use(xss());

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath);
});

app.listen(port, async () => {
  logger.info(`Express Server ready at http://localhost:${port}`)
});

const apolloServer = createApolloServer();

apolloServer.start().then(() => {
  logger.info(`🌚 Apollo Server ready at http://localhost:${port}/graphql`);
  apolloServer.applyMiddleware({ app })
});

export { app };
