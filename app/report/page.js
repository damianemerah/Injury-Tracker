"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Space, Typography, Button, Layout, theme } from "antd";
import { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import InjuryForm from "@/components/InjuryForm";
import BodyMap from "@/components/BodyMap";
import toast from "react-hot-toast";
import InjuryTable from "@/components/Table";
import { useQuery } from "@apollo/client";
import { GET_INJURIES, GET_REPORTERS } from "@/graphql/queries";

const { Content } = Layout;

const addInjury = (
  canvas,
  injuryFormRef,
  injuryCount,
  setInjuryCount,
  circleId
) => {
  const canvasLen = canvas.getObjects().length;
  const { description, treatment, part } =
    injuryFormRef.current.getFormValues();

  const newInjury = {
    description,
    treatment,
    injuryNumber: canvasLen,
    part,
  };

  // check if form is filled out
  if (!description || !treatment || !part) {
    toast("Please fill out the form and save before mapping another injury.");
    for (const [input, value] of Object.entries(
      injuryFormRef.current.getFormValues()
    )) {
      if (!value) {
        injuryFormRef.current.inputInstance(input).focus();
        break;
      }
    }

    return;
  }

  if (injuryFormRef.current.isEditing) {
    const { description, treatment, part } =
      injuryFormRef.current.getFormValues();

    const circleObj = canvas.getObjects().find((obj) => {
      return obj.id === circleId;
    });

    //problem here

    console.log("CircleObj", circleId, circleObj);

    if (circleObj.injuryDetails) {
      const circleObj = canvas.getObjects()[circleId - 1].injuryDetails;
      circleObj.description = description;
      circleObj.treatment = treatment;
      circleObj.part = part;
      return;
    }
  }

  //check if there is an injury mapped
  if (injuryCount + 1 === canvasLen) {
    canvas.getObjects()[injuryCount].injuryDetails = newInjury;
    setInjuryCount(canvasLen);
    toast.success("Injury mapped successfully!. Please submit the report.");
    injuryFormRef.current.resetFields();
    return;
  } else if (injuryCount + 1 > canvasLen) {
    toast("Map new the injury before saving.");
    return;
  }
};

const checkInjuryDetails = (
  canvas,
  injuryFormRef,
  injuryCount,
  setCircleId
) => {
  if (injuryFormRef.current.isEditing) {
    injuryFormRef.current.setIsEditing(false);
    injuryFormRef.current.resetFields();
  }

  if (canvas.getObjects().length === 0) {
    const newCircle = new fabric.Circle({
      radius: 50,
      fill: "rgba(255,0,0,0.5)",
      left: 0,
      top: 0,
    });

    newCircle.id = 1;
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
    newCircle.id = injuryCount + 1;
    setCircleId(injuryCount + 1);
    canvas.add(newCircle);
    canvas.renderAll();

    return;
  } else {
    toast("Please fill out the form and save before mapping another injury.");
    injuryFormRef.current.inputInstance("description").focus();
    return;
  }
};

export default function ReportInjury() {
  const bodyMapRef = useRef(null);
  const { user, error: auth0Error, isLoading } = useUser();
  const [canvas, setCanvas] = useState(null);
  const injuryFormRef = useRef(null);
  const [injuryCount, setInjuryCount] = useState(0);
  const [injury, setInjury] = useState({});
  const [circleId, setCircleId] = useState(0);

  const data = useQuery(GET_REPORTERS);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvasRef = bodyMapRef.current.canvasRef;
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      selection: false,
      backgroundColor: "transparent",
    });
    console.log(data);
    console.log(user);
    setCanvas(newCanvas);

    // const updateCanvasSize = () => {
    //   const containerRef = bodyMapRef.current.containerRef;
    //   const containerWidth = containerRef.current.offsetWidth;
    //   const containerHeight = containerRef.current.offsetHeight;

    //   const scaleX = containerWidth / 400;
    //   const scaleY = containerHeight / 400;

    //   newCanvas.setWidth(containerWidth);
    //   newCanvas.setHeight(containerHeight);

    //   newCanvas.setZoom(Math.min(scaleX, scaleY));
    // };

    newCanvas.on("mouse:dblclick", (e) => {
      if (e.target instanceof fabric.Circle) {
        console.log(e.target.id);
        handleDbClick(e.target);
      }
    });

    newCanvas.on("mouse:out", (e) => {
      if (e.target instanceof fabric.Circle)
        bodyMapRef.current.setShowDescription(false);
    });

    newCanvas.on("mouse:over", (e) => {
      if (e.target instanceof fabric.Circle) {
        bodyMapRef.current.setShowDescription(true);
        if (e.target.hasOwnProperty("injuryDetails"))
          bodyMapRef.current.setInjuryDetails("Double click to edit");
      }
    });
    newCanvas.on("object:moving", (e) => {
      if (e.target instanceof fabric.Circle) {
        bodyMapRef.current.setShowDescription(false);
        if (e.target.hasOwnProperty("injuryDetai"))
          bodyMapRef.current.setInjuryDetails("Double click to edit");
      }
    });
    newCanvas.on("object:modified", (e) => {
      if (e.target instanceof fabric.Circle) {
        bodyMapRef.current.setShowDescription(true);
        if (e.target.hasOwnProperty("injuryDetai"))
          bodyMapRef.current.setInjuryDetails("Double click to edit");
      }
    });

    // updateCanvasSize(); // Initialize canvas size
    // window.addEventListener("resize", updateCanvasSize);

    return () => {
      // window.removeEventListener("resize", updateCanvasSize);
      newCanvas.dispose();
    };
  }, [data, user]);

  const handleDbClick = (target) => {
    console.log(injuryFormRef.current);
    setCircleId(target.id);
    if (target.injuryDetails) {
      const { description, treatment, part, injuryNumber } =
        target.injuryDetails;
      injuryFormRef.current.setInjuryNumber(injuryNumber);
      injuryFormRef.current.setIsEditing(true);
      injuryFormRef.current.setFormValues({ description, treatment, part });
      return;
    }
    return;
  };

  const addInjuryDetail = () => {
    addInjury(canvas, injuryFormRef, injuryCount, setInjuryCount, circleId);
  };

  const mapInjury = () => {
    checkInjuryDetails(canvas, injuryFormRef, injuryCount, setCircleId);
  };

  const onFinish = (values) => {
    // const canvasData = JSON.stringify(canvas.toDatalessJSON());

    if (canvas.getObjects().length === 0) {
      toast("Please map an injury before submitting the report.");
      return;
    }

    if (
      canvas.getObjects().length > 0 &&
      canvas.getObjects().every((obj) => !obj.hasOwnProperty("injuryDetails"))
    ) {
      const noDetails = canvas.getObjects().find((obj) => {
        return obj.injuryDetails === undefined;
      });
      console.log("noDetails", noDetails);
    }

    // const { description, treatment, part } = values;

    // const injuryDetails = {
    //   description,
    //   treatment,
    //   injuryNumber: injuryCount,
    //   part,
    // };

    // const injury = {
    //   reporter: user.sub,
    //   injuryDetails,
    // };

    // console.log(injury);
  };

  const loadCanvas = () => {
    const retrievedCanvasData = localStorage.getItem("canvasData");
    const canvasData = JSON.parse(retrievedCanvasData);
    canvasData.objects[0].description = "test";

    canvas.clear();
    canvas.loadFromJSON(canvasData, canvas.renderAll.bind(canvas));
  };

  const deleteInjury = () => {
    const injury = canvas.getObjects().find((obj) => obj.id === circleId);
    if (injury) {
      canvas.remove(injury);
      toast.success("Injury Deleted");
    }
    canvas.getObjects().forEach((obj, index) => {
      if (obj.hasOwnProperty("injuryDetails")) {
        obj.injuryDetails.injuryNumber = index + 1;
        obj.id = index + 1;
      }
    });

    setInjuryCount(canvas.getObjects().length);
    injuryFormRef.current.setInjuryNumber(circleId);
    console.log(canvas.getObjects());
  };

  const saveInjury = () => {
    console.log("Saving injury");
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (isLoading) return <div>Loading...</div>;
  if (auth0Error) return <div>{error.message}</div>;

  return (
    <div>
      <Content
        style={{
          margin: "0 16px",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
          }}
        >
          <Typography.Title level={4}>Report Injury</Typography.Title>
          <Space style={{ marginBottom: 30 }}></Space>
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <div>
              <BodyMap ref={bodyMapRef} />
              <div style={{ textAlign: "center", marginTop: 15 }}>
                <Space>
                  <Button onClick={mapInjury}>Map Injury</Button>
                  <Button onClick={deleteInjury} danger type="text">
                    Delete Injury
                  </Button>
                </Space>
              </div>
            </div>
            <InjuryForm
              onFinish={onFinish}
              onClick={addInjuryDetail}
              saveInjury={saveInjury}
              ref={injuryFormRef}
            />
          </Space>
        </div>
      </Content>
      <Content
        style={{
          margin: "0 16px",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
          }}
        >
          <InjuryTable />
        </div>
      </Content>
    </div>
  );
}
