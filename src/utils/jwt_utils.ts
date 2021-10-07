import * as jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

export const getTokenData = async (token: string) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again. ',
      );
    }
  }
};
