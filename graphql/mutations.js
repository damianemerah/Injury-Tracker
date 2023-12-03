import { gql } from "graphql-tag";

export const NEW_REPORTER = gql`
  mutation CreateReporter($createReporterId: ID!, $input: ReporterInput!) {
    createReporter(id: $createReporterId, input: $input) {
      id
      name
      email
      injuryList {
        id
        injuryItem {
          bodyMap
          bodyPart
          createdAt
        }
      }
    }
  }
`;

export const NEW_INJURY = gql`
  mutation CreateInjury($reporterId: ID!, $input: CreateInjuryDataInput!) {
    createInjury(reporterId: $reporterId, input: $input) {
      id
      reporter {
        name
      }
      injuryItem {
        id
        bodyMap
        bodyPart
        description
        createdAt
        injuryDate
      }
    }
  }
`;

export const UPDATE_INJURY = gql`
  mutation UpdateInjury($updateInjuryId: ID!, $input: UpdateInjuryInput!) {
    updateInjury(id: $updateInjuryId, input: $input) {
      id
      reporter {
        id
        name
      }
      injuryItem {
        id
        bodyMap
        bodyPart
        description
        injuryDate
        createdAt
      }
    }
  }
`;

export const DELETE_INJURY = gql`
  mutation DeleteInjury($deleteInjuryId: ID!) {
    deleteInjury(id: $deleteInjuryId) {
      id
    }
  }
`;
