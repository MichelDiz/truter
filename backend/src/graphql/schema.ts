import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum Role {
    ADMIN
    CLIENT
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    createdAt: String!
  }

  type CryptoPrice {
    id: ID!
    coinId: String!
    marketCap: Float
    change24h: Float
    change7d: Float
    allTimeHigh: Float
    allTimeLow: Float
    currentPrice: Float!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    cryptoPrices: [CryptoPrice!]!
    liveCryptoPrice(coinId: String!): CryptoPrice!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, role: Role!): User!
    updateCryptoPrice(coinId: String!): CryptoPrice!
  }
`;
