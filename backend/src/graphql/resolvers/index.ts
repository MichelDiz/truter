import { resolvers as userResolvers } from './user.resolver';
import { cryptoResolvers } from './crypto.resolver';

type ResolverMap = {
  Query?: Record<string, Function>;
  Mutation?: Record<string, Function>;
};

export const resolvers: ResolverMap = {
  Query: {
    ...userResolvers.Query,
    ...cryptoResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...cryptoResolvers.Mutation,
  },
};
