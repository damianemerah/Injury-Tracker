"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Space, Typography, Button, Layout, theme } from "antd";
import { useRef, useEffect, Fragment } from "react";
import { fabric } from "fabric";
import InjuryForm from "@/components/InjuryForm";
import BodyMap from "@/components/BodyMap";
import InjuryTable from "@/components/Table";
import { useInjury } from "@/components/context/InjuryContext";
import { useInjuryMap } from "@/components/context/InjuryMapContext";
import dayjs from "dayjs";

const { Content } = Layout;

export default function ReportInjury() {
  const bodyMapRef = useRef(null);
  const { user } = useUser();

  const {
    mapInjury,
    addInjuryDetail,
    removeMap,
    setCircleId,
    canvas,
    setCanvas,
    setIsEditing,
    setShowDescription,
    form,
    setInjuryDetails,
    injurySaveType,
    resetMap,
  } = useInjuryMap();

  const { saveInjury, deleteInjuryDB } = useInjury();

  useEffect(() => {
    //   // Initialize Fabric.js canvas
    const canvasRef = bodyMapRef.current.canvasRef;
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      selection: false,
      backgroundColor: "transparent",
    });
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

    // updateCanvasSize(); // Initialize canvas size
    // window.addEventListener("resize", updateCanvasSize);

    return () => {
      // window.removeEventListener("resize", updateCanvasSize);
      newCanvas.dispose();
    };
  }, [setCanvas, user]);

  //CANVAS EVENTS
  if (canvas)
    canvas.on("mouse:dblclick", (e) => {
      if (e.target instanceof fabric.Circle) {
        setCircleId(e.target.circleId);
        if (e.target.injuryDetails) {
          const { description, date, bodyPart } = e.target.injuryDetails;
          setIsEditing(true);
          form.setFieldsValue({ description, date: dayjs(date), bodyPart });
          return;
        }
        return;
      }
    });
  if (canvas)
    canvas.on("mouse:out", (e) => {
      if (e.target instanceof fabric.Circle) setShowDescription(false);
    });
  if (canvas)
    canvas.on("mouse:over", (e) => {
      if (e.target instanceof fabric.Circle) {
        setShowDescription(true);
        if (e.target.hasOwnProperty("injuryDetails"))
          setInjuryDetails(
            <Fragment>
              {`${e.target.circleId}: Double click to edit.`}
              <br />
              {`Desc: ${e.target.injuryDetails.description.slice(0, 30)}`}
            </Fragment>
          );
        else setInjuryDetails("No description");
      }
    });
  if (canvas)
    canvas.on("object:moving", (e) => {
      if (e.target instanceof fabric.Circle) setShowDescription(false);
    });
  if (canvas)
    canvas.on("object:modified", (e) => {
      if (e.target instanceof fabric.Circle) setShowDescription(true);
    });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
            className="body-map-container"
          >
            <div>
              <BodyMap ref={bodyMapRef} />
              <div
                style={{
                  textAlign: "center",
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                <Space>
                  <Button onClick={mapInjury}>Map Injury</Button>
                  <Button onClick={removeMap} danger type="text">
                    Remove Map
                  </Button>
                  <Button onClick={resetMap} danger type="text">
                    Clear Map
                  </Button>
                </Space>
              </div>
            </div>
            <InjuryForm addInjuryDetail={addInjuryDetail} />
          </Space>
          {canvas
            ?.getObjects()
            .some((obj) => obj.hasOwnProperty("injuryDetails")) && (
            <Space
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button htmlType="button" onClick={saveInjury} type="primary">
                Save To Cloud
              </Button>
              {injurySaveType == "update" && (
                <Button onClick={deleteInjuryDB} danger type="primary">
                  Delete Injury
                </Button>
              )}
            </Space>
          )}
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
