import logger from "../loggers/winston"

export default {
  Query: {
    ping: (parent, {}, context) => {
      logger.debug('ping back');
    }
  },
  Mutation: {

  }
}
