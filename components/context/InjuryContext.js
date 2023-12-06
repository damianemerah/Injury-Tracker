"use client";

import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INJURIES } from "@/graphql/queries";
import { NEW_INJURY, UPDATE_INJURY, DELETE_INJURY } from "@/graphql/mutations";
import { useUserContext } from "./UserContext";
import { useInjuryMap } from "./InjuryMapContext";
import dayjs from "dayjs";
import { Spin } from "antd";

const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const InjuryContext = createContext();

const InjuryProvider = ({ children }) => {
  const { user, isLoading } = useUserContext();
  const [injuries, setInjuries] = useState([]);
  const { resetMap, injurySaveType, setIsEditing, form, canvas } =
    useInjuryMap();

  // QUERIES AND MUTATIONS
  const {
    data: injuryData,
    loading: injuryLoading,
    error: injuryError,
  } = useQuery(GET_INJURIES);

  const [createInjury] = useMutation(NEW_INJURY, {
    refetchQueries: [{ query: GET_INJURIES }],
  });

  const [updateInjury] = useMutation(UPDATE_INJURY);
  const [deleteInjury] = useMutation(DELETE_INJURY, {
    refetchQueries: [{ query: GET_INJURIES }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (injuryData) {
          setInjuries(injuryData?.injuries);
        }
      } catch (error) {
        toast.error("🤒", error.message);
      }
    };

    fetchData();
  }, [injuries, injuryData]);

  const saveInjury = async () => {
    try {
      if (canvas.getObjects().length === 0) {
        toast("Please map an injury before submitting the report.");
        return;
      }

      if (
        canvas.getObjects().length > 0 &&
        canvas.getObjects().every((obj) => obj.hasOwnProperty("injuryDetails"))
      ) {
        const canvasData = JSON.stringify(canvas.toDatalessJSON());

        const injuryItem = canvas.getObjects().map((obj) => {
          return {
            id: obj?.id,
            bodyMap: canvasData,
            bodyPart: obj.injuryDetails.bodyPart,
            description: obj.injuryDetails.description,
            injuryDate: new Date(obj.injuryDetails.date).toISOString(),
          };
        });

        if (injurySaveType === "update") {
          const id = canvas.getObjects().filter((obj) => {
            return obj.hasOwnProperty("parentId");
          })[0].parentId;

          await updateInjury({
            variables: {
              updateInjuryId: id,
              input: { injuryItem: injuryItem },
            },
          });
        } else if (injurySaveType === "new") {
          await createInjury({
            variables: {
              reporterId: user?.id,
              input: { injuryItem: injuryItem },
            },
          });
        }

        toast.success("Report submitted successfully!");

        // canvas.clear();
        // setInjuryCount(0);
        // setCircleId(0);
        resetMap();
      } else {
        const noDetails = canvas.getObjects().find((obj) => {
          return obj.injuryDetails === undefined;
        });

        return toast(
          `ID: ${noDetails.id}. No description for injury. Save detail before submitting the report.`
        );
      }
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      toast.error(error.message);
      resetMap();
    }
  };

  const deleteInjuryDB = async () => {
    const id = canvas.getObjects().filter((obj) => {
      return obj.hasOwnProperty("parentId");
    })[0].parentId;

    await deleteInjury({
      variables: { deleteInjuryId: id },
    });

    toast.success("Injury deleted successfully!");

    resetMap();
  };

  if (injuryLoading || isLoading)
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginBottom: 20,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (!injuries) return <p>No injuries found</p>;

  return (
    <InjuryContext.Provider
      value={{
        injuries,
        saveInjury,
        deleteInjuryDB,
        injuryLoading,
      }}
    >
      {children}
    </InjuryContext.Provider>
  );
};

function useInjury() {
  const context = useContext(InjuryContext);
  if (context === undefined) {
    throw new Error("useInjury must be used within a InjuryProvider");
  }
  return context;
}

export { useInjury, InjuryProvider };

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nisi reprehenderit, aut, facilis consectetur ullam molestiae amet veritatis adipisci suscipit debitis? Excepturi, illum repellendus voluptatem quas reiciendis deleniti ipsam doloremque dolorem fugiat maxime dolorum culpa quis odit mollitia eos ab.
