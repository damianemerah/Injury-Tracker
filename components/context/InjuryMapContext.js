"use client";

import { fabric } from "fabric";
import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";
import { Form } from "antd";

const InjuryMapContext = createContext();

const originalToObject = fabric.Object.prototype.toObject;
const myAdditional = ["id", "circleId", "injuryDetails"];
fabric.Object.prototype.toObject = function (additionalProperties) {
  return originalToObject.call(this, myAdditional.concat(additionalProperties));
};

const InjuryMapProvider = ({ children }) => {
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

      setCircleId(canvas.getObjects().length);
      setInjuryCount(canvas.getObjects().length);
    }
  };

  return (
    <InjuryMapContext.Provider
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
        setInjurySaveType,
        injurySaveType,
        setInjuryCount,
        showDescription,
        resetMap,
      }}
    >
      {children}
    </InjuryMapContext.Provider>
  );
};

function useInjuryMap() {
  const context = useContext(InjuryMapContext);
  if (context === undefined) {
    throw new Error("useInjuryMap must be used within a InjuryMapProvider");
  }
  return context;
}

export { useInjuryMap, InjuryMapProvider };
