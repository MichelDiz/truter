import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Detecta se está rodando em ambiente Docker
const isDocker = window.location.hostname === 'nginx';
const API_URL = import.meta.env.VITE_API_URL || (isDocker ? "http://nginx/graphql" : "http://localhost:4000/graphql");

const client = new ApolloClient({
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache(),
});

export default client;
