import logger from '../loggers/winston';

export const errorLoggingMiddleware = {
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
