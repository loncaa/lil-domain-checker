import logger from "../loggers/winston"

export default {
  Query: {
    ping: (parent, {}, context) => {
      return 'ping back';
    }
  },
  Mutation: {

  }
}
