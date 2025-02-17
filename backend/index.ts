import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './src/graphql/schema';
import { resolvers } from './src/graphql/resolvers';
import './src/services/cryptoUpdater';

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
