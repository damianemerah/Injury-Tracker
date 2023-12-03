import { gql } from "graphql-tag";

export const GET_INJURIES = gql`
  query Injuries {
    injuries {
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

export const GET_REPORTER = gql`
  query Reporter($reporterId: ID!) {
    reporter(id: $reporterId) {
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
