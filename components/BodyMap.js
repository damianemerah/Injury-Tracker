import { useInjuryMap } from "@/components/context/InjuryMapContext";
import { Card, Tooltip } from "antd";
import { useRef, forwardRef, useImperativeHandle } from "react";

const BodyMap = forwardRef(function BodyMap(props, ref) {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    canvasRef,
  }));

  const { showDescription, injuryDetails } = useInjuryMap();

  return (
    <Card style={{ display: "inline-block", flex: 1, position: "relative" }}>
      <Tooltip open={showDescription} title={injuryDetails}></Tooltip>
      <div
        style={{
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
  );
});

export default BodyMap;
