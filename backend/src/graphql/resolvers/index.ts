import { resolvers as userResolvers } from './user.resolver';
import { cryptoResolvers } from './crypto.resolver';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...cryptoResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...cryptoResolvers.Mutation,
  },
};
