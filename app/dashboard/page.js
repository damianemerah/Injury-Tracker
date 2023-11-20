"use client";

import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Space, Typography, Card, Statistic, Layout, theme } from "antd";
import {
  MedicineBoxOutlined,
  FieldTimeOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { useInjury } from "@/context/BodyMapContext";
import { fabric } from "fabric";

const { Content } = Layout;

export default function ProfileClient() {
  const canvasRef = useRef(null);
  const { user, error, isLoading } = useUser();
  const [canvas, setCanvas] = useState(null);
  const containerRef = useRef(null);
  const injuryContext = useInjury();

  console.log(injuryContext);

  useEffect(() => {
    // Initialize Fabric.js canvas on the client side
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      selection: false,
      backgroundColor: "transparent",
    });

    setCanvas(newCanvas);

    const updateCanvasSize = () => {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const scaleX = containerWidth / 400; // Calculate the horizontal scale
      const scaleY = containerHeight / 400; // Calculate the vertical scale

      newCanvas.setWidth(containerWidth);
      newCanvas.setHeight(containerHeight);

      // Set the zoom to the minimum of horizontal and vertical scales
      newCanvas.setZoom(Math.min(scaleX, scaleY));
    };

    updateCanvasSize(); // Initialize canvas size
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      newCanvas.dispose();
    };
  }, []);

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: "rgba(255,0,0,0.5)",
      left: 0,
      top: 0,
    });

    canvas.add(circle);
    canvas.renderAll();
  };

  const saveCanvas = () => {
    const canvasData = JSON.stringify(canvas.toDatalessJSON());

    localStorage.setItem("canvasData", canvasData);
  };

  const loadCanvas = () => {
    const retrievedCanvasData = localStorage.getItem("canvasData");
    const canvasData = JSON.parse(retrievedCanvasData);

    canvas.clear();
    canvas.loadFromJSON(canvasData, canvas.renderAll.bind(canvas));
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Content
      style={{
        margin: "0 16px",
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
        }}
      >
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Overview
        </Typography.Title>
        <Typography.Title level={4}>Overview</Typography.Title>
        <Space style={{ marginBottom: 30 }}>
          <DashboardCard
            icon={
              <FieldTimeOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0, 255, 0, 0.25",
                  borderRadius: 50,
                  padding: 10,
                }}
              />
            }
            title={"This Week"}
            value={1234}
          />
          <DashboardCard
            icon={
              <FieldTimeOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255, 0, 0, 0.25",
                  borderRadius: 50,
                  padding: 10,
                }}
              />
            }
            title={"Last Month"}
            value={1234}
          />
        </Space>
        <Typography.Title level={4}>Last Reported Injury:</Typography.Title>
        <button onClick={saveCanvas}>Save Circle</button>
        <button onClick={loadCanvas}>Load Circle</button>
        <div>
          <button onClick={addCircle}>Add Circle</button>
          <Card style={{ display: "inline-block" }}>
            <div
              ref={containerRef}
              style={{
                width: "100%",
                height: "100%",
                background: "url('/body-map.jpeg')",
                backgroundSize: "contain",
                position: "relative",
              }}
            >
              <canvas
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                ref={canvasRef}
              />
              <p
                style={{
                  position: "absolute",
                  bottom: 0,
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Front</span>
                <span>Back</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card style={{ borderWidth: 3 }}>
      <Space>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
