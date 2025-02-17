import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum Role {
    ADMIN
    CLIENT
  }

  type User {
    id: ID!
    name: String!
    username: String
    email: String!
    role: Role!
    createdAt: String!
  }

  type AuthPayload {
    user: User
    message: String!
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
    userById(id: ID!): User
    userByEmail(email: String!): User
    userByName(name: String!): [User!]!
    usersByRole(role: Role!): [User!]!
    
    cryptoPrices: [CryptoPrice!]!
    cryptoById(id: ID!): CryptoPrice
    cryptoByCoinId(coinId: String!): CryptoPrice
    cryptosAboveMarketCap(minMarketCap: Float!): [CryptoPrice!]!
    cryptosWithPriceRange(minPrice: Float!, maxPrice: Float!): [CryptoPrice!]!
    liveCryptoPrice(coinId: String!): CryptoPrice!
  }

  type Mutation {
    createUser(name: String!, email: String!, username: String, password: String!, role: Role!): User!
    updateUser(id: ID!, name: String, username: String, email: String, role: Role, currentPassword: String!, newPassword: String): User!
    updateCryptoPrice(coinId: String!): CryptoPrice!
    loginUser(username: String!, password: String!): AuthPayload!
  }

`;
