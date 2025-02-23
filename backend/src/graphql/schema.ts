import { gql } from 'graphql-tag';

export const typeDefs = gql`
"""
Enum que define os papéis possíveis de um usuário
"""
  enum Role {
    ADMIN
    CLIENT
  }

"""
Tipo que representa um usuário no sistema 
"""
  type User {
    id: ID!
    name: String!
    username: String
    email: String!
    """
    Papel atribuído ao usuário (ADMIN ou CLIENT)
    """
    role: Role! 
    createdAt: String!
  }

"""
Payload retornado após autenticação
"""
  type AuthPayload {
    user: User 
    message: String!
    """
    Chave de autenticação/token
    """
    key: String!
  }

"""
Tipo que representa o preço de uma criptomoeda
"""
  type CryptoPrice {
    id: ID!
    """
    Identificador único da criptomoeda
    """
    coinId: String!
    marketCap: Float
    change24h: Float
    change7d: Float
    allTimeHigh: Float
    allTimeLow: Float
    currentPrice: Float!
    updatedAt: String!
  }

"""
Consultas disponíveis no sistema
"""
  type Query {
  """
  Retorna uma lista de todos os usuários
  """
    users: [User!]!
  """
  Retorna um usuário específico pelo ID
  """
    userById(id: ID!): User
  """
  Retorna um usuário específico pelo e-mail
  """
    userByEmail(email: String!): User
  """
  Retorna uma lista de usuários que possuem um determinado nome
  """
    userByName(name: String!): [User!]!
  """
  Retorna uma lista de usuários filtrados pelo papel (ADMIN ou CLIENT)
  """
    usersByRole(role: Role!): [User!]!
  """
  Retorna uma lista de preços de todas as criptomoedas
  """
    cryptoPrices: [CryptoPrice!]!

  """
  Retorna o preço de uma criptomoeda específica pelo ID
  """
    cryptoById(id: ID!): CryptoPrice

  """
  Retorna o preço de uma criptomoeda específica pelo coinId (ex: 'Bitcoin')
  """
    cryptoByCoinId(coinId: String!): CryptoPrice

  """
  Retorna uma lista de criptomoedas que possuem capitalização de mercado acima de um valor mínimo
  """
    cryptosAboveMarketCap(minMarketCap: Float!): [CryptoPrice!]!

  """
  Retorna uma lista de criptomoedas que estão em uma faixa de preço específica
  """
    cryptosWithPriceRange(minPrice: Float!, maxPrice: Float!): [CryptoPrice!]!

  """
  Retorna o preço ao vivo de uma criptomoeda pelo coinId
  """
    liveCryptoPrice(coinId: String!): CryptoPrice!
  }

"""
Mutations disponíveis no sistema
"""
  type Mutation {
  """
  Cria um novo usuário no sistema
  Se o papel for ADMIN, a 'authKey' deve ser fornecida
  """
    createUser(
      name: String!
      email: String!
      username: String
      password: String!
      role: Role!
      authKey: String
    ): User!

  """
  Atualiza um usuário existente no sistema
  Para trocar a senha, 'currentPassword' deve ser fornecida
  """
    updateUser(
      id: ID!
      name: String
      username: String
      email: String
      role: Role
      currentPassword: String!
      newPassword: String
      authKey: String
    ): User!

  """
  Faz uma atualização manual do preço de uma criptomoeda pelo coinId
  """
    updateCryptoPrice(coinId: String!): CryptoPrice!

  """
  Realiza o login do usuário e retorna um token de autenticação
  """
    loginUser(username: String!, password: String!): AuthPayload!
  }
`;
