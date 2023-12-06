import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Reporter {
    id: ID!
    name: String!
    email: String
    injuryList: [InjuryData]!
    createdAt: DateTime!
    updatedAt: DateTime!
    image: String
  }

  type InjuryData {
    id: ID!
    reporter: Reporter!
    injuryItem: [Injury]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Injury {
    id: ID!
    relatedInjuries: InjuryData!
    createdAt: DateTime!
    updatedAt: DateTime!
    bodyMap: String!
    bodyPart: String!
    description: String!
    injuryDate: DateTime!
  }

  type Query {
    injuries: [InjuryData]!
    injury(id: ID!): InjuryData
    reporter(id: ID!): Reporter
    getInjury(id: ID!): Injury
  }

  type Mutation {
    createReporter(id: ID!, input: ReporterInput!): Reporter!
    updateReporter(id: ID!, input: UpdateReporterInput!): Reporter!
    deleteReporter(id: ID!): Reporter!
    createInjury(reporterId: ID!, input: CreateInjuryDataInput!): InjuryData!
    updateInjury(id: ID!, input: UpdateInjuryInput!): InjuryData!
    deleteInjury(id: ID!): InjuryData!
  }

  input ReporterInput {
    name: String!
    email: String
    image: String
    injuryList: [CreateInjuryDataInput]!
  }

  input UpdateReporterInput {
    name: String
    email: String
    image: String
  }

  input InjuryInput {
    bodyMap: String!
    bodyPart: String!
    description: String!
    injuryDate: DateTime!
  }

  input UpdateInjuryInputData {
    id: ID
    bodyMap: String!
    bodyPart: String!
    description: String!
    injuryDate: DateTime!
  }

  input CreateInjuryDataInput {
    injuryItem: [InjuryInput!]!
  }

  input UpdateInjuryInput {
    injuryItem: [UpdateInjuryInputData!]!
  }

  scalar DateTime
`;
