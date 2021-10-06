import logger from './winston';
import * as morgan from 'morgan';

const stream: morgan.StreamOptions = {
    write: (message) => {
      logger.http(message.trim())
    },
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

// Build the morgan middleware
export default morgan(
   ":remote-addr :method :url :status - :response-time ms",
    { stream, skip }
);
