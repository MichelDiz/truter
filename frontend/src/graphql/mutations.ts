import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $username: String!
    $password: String!
    $role: Role!
    $authKey: String!
  ) {
    createUser(
      name: $name
      email: $email
      username: $username
      password: $password
      role: $role
      authKey: $authKey
    ) {
      id
      name
      email
      role
    }
  }
`;
