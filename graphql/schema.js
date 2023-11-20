import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Reporter {
    id: ID!
    name: String!
    email: String
    injuries: [Injury]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Injury {
    id: ID!
    reporter: Reporter!
    createdAt: DateTime!
    updatedAt: DateTime!
    bodyMap: String!
    parts: [String!]!
  }

  type Query {
    injuries: [Injury!]!
    reporter(id: ID!): Reporter
    reporters: [Reporter!]!
    injury(reporterId: ID!): Injury
    parts(filter: [String!]!): [Injury!]!
  }

  type Mutation {
    createReporter(id: ID!, input: ReporterInput!): Reporter!
    updateReporter(id: ID!, input: ReporterInput!): Reporter!
    deleteReporter(id: ID!): Reporter!
    createInjury(reporterId: ID!, input: InjuryInput!): Injury!
    updateInjury(id: ID!, input: InjuryInput!): Injury!
    deleteInjury(id: ID!): Injury!
  }

  input ReporterInput {
    id: ID!
    name: String!
    email: String
    injuries: [InjuryInput]!
  }

  input InjuryInput {
    bodyMap: String!
    parts: [String!]!
  }

  scalar DateTime
`;
