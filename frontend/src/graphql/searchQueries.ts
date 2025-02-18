import { gql } from "@apollo/client";

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      name
      role
    }
  }
`;

export const GET_USER_BY_NAME = gql`
  query GetUserByName($name: String!) {
    userByName(name: $name) {
      id
      email
      role
    }
  }
`;
