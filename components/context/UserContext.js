"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery } from "@apollo/client";
import { NEW_REPORTER } from "@/graphql/mutations";
import { GET_REPORTER } from "@/graphql/queries";
import toast from "react-hot-toast";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const { user: auth0User, error: auth0Error, isLoading } = useUser();

  const {
    loading: reporterLoading,
    error: reporterError,
    data: reporterData,
  } = useQuery(GET_REPORTER, {
    variables: { reporterId: userId },
    skip: !userId,
  });

  const [createReporter] = useMutation(NEW_REPORTER);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        if (!isLoading && !auth0User) {
          return redirect("/api/auth/login");
        }

        if (!isLoading && auth0User) {
          const id = auth0User.sub.split("|")[1];
          setUserId(id);
        }

        // Set user data if available
        if (reporterData && userId === reporterData?.reporter?.id) {
          setUser(reporterData.reporter);
        }

        // If no user data, create a new user
        if (
          !user &&
          !reporterLoading &&
          userId &&
          !isLoading &&
          !reporterData
        ) {
          try {
            const { name, email } = auth0User;
            const {
              data: { createReporter: newReporter },
            } = await createReporter({
              variables: {
                createReporterId: userId,
                input: {
                  name,
                  email,
                  injuryList: [],
                },
              },
            });

            setUser(newReporter);
          } catch (createReporterError) {
            toast.error(error.message);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [
    userId,
    auth0User,
    isLoading,
    reporterData,
    reporterError,
    reporterLoading,
    createReporter,
    user,
  ]);

  if (auth0Error) return <div>{auth0Error.message}</div>;

  return (
    <UserContext.Provider value={{ user, setUser, userId, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export { useUserContext, UserProvider };
