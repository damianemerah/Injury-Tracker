"use client";

import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { fabric } from "fabric";
import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Form } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INJURIES, GET_REPORTER } from "@/graphql/queries";
import {
  NEW_INJURY,
  NEW_REPORTER,
  UPDATE_INJURY,
  DELETE_INJURY,
} from "@/graphql/mutations";

const InjuryContext = createContext();

const originalToObject = fabric.Object.prototype.toObject;
const myAdditional = ["id", "circleId", "injuryDetails"];
fabric.Object.prototype.toObject = function (additionalProperties) {
  return originalToObject.call(this, myAdditional.concat(additionalProperties));
};

const InjuryProvider = ({ children }) => {
  const [form] = Form.useForm();
  const [canvas, setCanvas] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [circleId, setCircleId] = useState(0);
  const [injuryCount, setInjuryCount] = useState(0);
  const [injuryDetails, setInjuryDetails] = useState(
    `ID: ${circleId}. No description`
  );
  const [injurySaveType, setInjurySaveType] = useState("new");

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [injuries, setInjuries] = useState([]);

  // QUERIES AND MUTATIONS
  const {
    data: injuryData,
    loading: injuryLoading,
    error: injuryError,
  } = useQuery(GET_INJURIES);

  const {
    loading: reporterLoading,
    error: reporterError,
    data: reporterData,
  } = useQuery(GET_REPORTER, {
    variables: { reporterId: userId },
    skip: !userId,
  });

  const { user: auth0User, error: auth0Error, isLoading } = useUser();

  const [createInjury] = useMutation(NEW_INJURY, {
    refetchQueries: [{ query: GET_INJURIES }],
  });

  const [createReporter] = useMutation(NEW_REPORTER);
  const [updateInjury] = useMutation(UPDATE_INJURY);
  const [deleteInjury] = useMutation(DELETE_INJURY, {
    refetchQueries: [{ query: GET_INJURIES }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        if (!isLoading && !auth0User) {
          return redirect("/api/auth/login");
        }

        // Set user ID on authentication
        if (!isLoading && auth0User) {
          const id = auth0User.sub.split("|")[1];
          setUserId(id);
        }

        // Set user data if available
        if (reporterData && userId === reporterData?.reporter?.id) {
          setUser(reporterData);
        }

        // If no user data, create a new user
        if (!user && !reporterError && !reporterLoading && userId) {
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
            console.error(
              "Error creating reporter:",
              createReporterError.message
            );
            toast.error("Error creating reporter");
          }
        }

        if (injuryData) {
          setInjuries(injuryData?.injuries);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [
    createReporter,
    injuries,
    injuryData,
    auth0User,
    reporterData,
    userId,
    user,
    isLoading,
    reporterLoading,
    reporterError,
    injuryCount,
  ]);

  // const onChange = (date, dateString) => {
  //   console.log(date, dateString);
  // };

  const resetMap = () => {
    canvas.clear();
    setCircleId(0);
    setIsEditing(false);
    setInjuryCount(0);
    form.resetFields();
    setInjurySaveType("new");
  };

  const mapInjury = () => {
    if (canvas.getObjects().length === 0) {
      setInjurySaveType("new");
    }

    if (isEditing) {
      setIsEditing(false);
      form.resetFields();
    }

    if (canvas.getObjects().length === 0) {
      const newCircle = new fabric.Circle({
        radius: 50,
        fill: "rgba(255,0,0,0.5)",
        left: 0,
        top: 0,
      });

      newCircle.circleId = 1;
      setCircleId(1);
      canvas.add(newCircle);
      canvas.renderAll();
      return;
    }

    if (
      canvas.getObjects().length > 0 &&
      canvas.getObjects().every((obj) => obj.hasOwnProperty("injuryDetails"))
    ) {
      const newCircle = new fabric.Circle({
        radius: 50,
        fill: "rgba(255,0,0,0.5)",
        left: 0,
        top: 0,
      });
      newCircle.circleId = injuryCount + 1;
      setCircleId(injuryCount + 1);
      canvas.add(newCircle);
      canvas.renderAll();
      console.log(canvas.getObjects());
      return;
    } else {
      toast("Please fill out the form and save before mapping another injury.");
      form.getFieldInstance("description").focus();
      return;
    }
  };

  const addInjuryDetail = () => {
    const canvasLen = canvas.getObjects().length;

    const { description, bodyPart, date } = form.getFieldsValue();

    let injuryDate;

    if (date) {
      injuryDate = date.format("YYYY-MM-DD HH:mm");
    }

    const newInjury = {
      description,
      bodyPart,
      date: injuryDate,
    };

    // check if form is filled out
    if (!description || !bodyPart || !date) {
      toast("Please fill out the form and save before mapping another injury.");
      for (const [input, value] of Object.entries(form.getFieldsValue())) {
        if (!value) {
          form.getFieldInstance(input).focus();
          break;
        }
      }
      return;
    }

    if (isEditing) {
      const { description, date, bodyPart } = form.getFieldsValue();

      const circleObj = canvas.getObjects().find((obj) => {
        return obj.circleId === circleId;
      });

      if (circleObj.injuryDetails) {
        const circleObj = canvas.getObjects()[circleId - 1].injuryDetails;
        circleObj.description = description;
        circleObj.date = date;
        circleObj.bodyPart = bodyPart;

        toast.success(
          "Injury updated successfully!. Please submit the report."
        );
        return;
      }
    }

    //check if there is an injury mapped
    if (injuryCount + 1 === canvasLen) {
      canvas.getObjects()[injuryCount].injuryDetails = newInjury;
      setInjuryCount(canvasLen);
      toast.success("Injury mapped successfully!. Please submit the report.");
      form.resetFields();

      return;
    } else if (injuryCount + 1 > canvasLen) {
      console.log("injuryCount", injuryCount, canvasLen);
      toast("Map new the injury before saving.");
      return;
    }
  };

  const removeMap = () => {
    if (canvas) {
      const injury = canvas
        .getObjects()
        .find((obj) => obj.circleId === circleId);
      if (injury) {
        canvas.remove(injury);
        toast.success("Injury Deleted");
      }
      canvas.getObjects().forEach((obj, index) => {
        if (obj.hasOwnProperty("injuryDetails")) {
          obj.circleId = index + 1;
        }
      });

      setInjuryCount(canvas.getObjects().length);
    }
  };

  const saveInjury = async () => {
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

        console.log("update", id);

        await updateInjury({
          variables: {
            updateInjuryId: id,
            input: { injuryItem: injuryItem },
          },
        });
      } else if (injurySaveType === "new") {
        console.log("new");
        await createInjury({
          variables: { reporterId: userId, input: { injuryItem: injuryItem } },
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

  if (isLoading) return <div>Loading...</div>;
  if (auth0Error) return <div>{auth0Error.message}</div>;

  return (
    <InjuryContext.Provider
      value={{
        mapInjury,
        addInjuryDetail,
        removeMap,
        setCircleId,
        circleId,
        canvas,
        setCanvas,
        form,
        isEditing,
        setIsEditing,
        showDescription,
        setShowDescription,
        injuryDetails,
        setInjuryDetails,
        user,
        userId,
        saveInjury,
        injuries,
        setInjurySaveType,
        injurySaveType,
        setInjuryCount,
        showDescription,
        deleteInjuryDB,
        resetMap,
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
