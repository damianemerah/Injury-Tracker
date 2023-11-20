import { Card, Tooltip } from "antd";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

const BodyMap = forwardRef(function BodyMap(props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const injuryDetailsRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false);
  const [injuryDetails, setInjuryDetails] = useState("No description");
  const [overlayPosition, setOverlayposition] = useState({ left: 0, right: 0 });

  useImperativeHandle(ref, () => ({
    canvasRef,
    containerRef,
    showDescription,
    setShowDescription,
    injuryDetails,
    setInjuryDetails,
    injuryDetailsRef,
  }));

  return (
    <Card style={{ display: "inline-block", flex: 1, position: "relative" }}>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: showDescription ? "block" : "none",
          zIndex: 15000,
          padding: 10,
          background: "yellowgreen",
          borderRadius: 5,
          maxWidth: 200,
        }}
        ref={injuryDetailsRef}
      >
        <span>{injuryDetails}</span>
      </div>

      <div
        style={{
          background: "url('/body-map.jpeg')",
          backgroundSize: "contain",
          position: "relative",
        }}
        ref={containerRef}
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
  );
});

export default BodyMap;
