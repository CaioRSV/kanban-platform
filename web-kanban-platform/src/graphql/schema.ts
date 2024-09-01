// graphql/schema.ts
import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};