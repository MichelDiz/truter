import { gql } from "@apollo/client";

export const GET_ALL_CRYPTOS = gql`
  query {
    cryptoPrices {
      id
      coinId
      currentPrice
      marketCap
      change24h
      updatedAt
    }
  }
`;

export const GET_CRYPTO_BY_ID = gql`
  query GetCryptoById($coinId: String!) {
    cryptoByCoinId(coinId: $coinId) {
      id
      coinId
      currentPrice
      marketCap
      change24h
      updatedAt
    }
  }
`;
