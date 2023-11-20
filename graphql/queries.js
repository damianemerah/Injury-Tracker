import { gql } from "graphql-tag";

export const NEW_REPORTER = gql`
  mutation Reporter {
    createReporter(
      id: "createReporterId2"
      input: { name: "Second reporter", injuries: [] }
    ) {
      id
      name
      email
      injuries {
        bodyMap
        parts
      }
    }
  }
`;

export const GET_INJURIES = gql`
  query Injuries {
    injuries {
      bodyMap
      parts
      createdAt
      reporter {
        id
        name
      }
    }
  }
`;

export const GET_REPORTERS = gql`
  query Reporters {
    reporters {
      id
      name
      email
      injuries {
        bodyMap
        parts
      }
    }
  }
`;
