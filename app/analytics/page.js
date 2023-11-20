"use client";

import { useQuery, gql } from "@apollo/client";
import { GET } from "../api/graphql/route"; // Adjust the path accordingly

const GET_INJURIES = gql`
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

const MyComponent = () => {
  const { loading, error, data } = useQuery(GET_INJURIES, {
    variables: {},
    fetchPolicy: "network-only",
  });

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error("GraphQL error:", error);

    // Check if the error includes a network error
    if (error.networkError) {
      console.error("Network error:", error.networkError);
    }

    return <p>Error fetching data. Please try again.</p>;
  }

  const injuries = data?.injuries || [];

  return (
    <div>
      {injuries.map((injury) => (
        <div key={injury.createdAt}>
          <p>Body Map: {injury.bodyMap}</p>
          <p>Parts: {injury.parts}</p>
          <p>Reporter: {injury.reporter.name}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MyComponent;
