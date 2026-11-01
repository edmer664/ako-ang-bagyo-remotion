import React from "react";
import { oswald } from "../fonts";

interface WorldParallaxProps {
  accentColor: string;
}

export const WorldParallaxElements: React.FC<WorldParallaxProps> = ({
  accentColor,
}) => {
  // Waypoint depth coordinates
  const depths = [
    -500, -2000, -4500, -7500, -11000, -15000, -19500, -24000, -28000,
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Infinite Grid Floor */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 8000,
          height: 35000,
          transform: "translate(-50%, -50%) rotateX(90deg) translateZ(750px)",
          backgroundImage: `
            linear-gradient(to right, ${accentColor}18 1px, transparent 1px),
            linear-gradient(to bottom, ${accentColor}18 1px, transparent 1px)
          `,
          backgroundSize: "160px 160px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 95%)",
        }}
      />

      {/* Floating Spatial Landmark Rings along the Z trajectory */}
      {depths.map((depth, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 1400,
            height: 900,
            transform: `translate(-50%, -50%) translate3d(${
              (idx % 2 === 0 ? -1 : 1) * 350
            }px, ${(idx % 3 === 0 ? -1 : 1) * 200}px, ${depth}px)`,
            border: `1px dashed ${accentColor}25`,
            borderRadius: 16,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: 24,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: oswald.fontFamily,
              fontSize: 14,
              color: accentColor,
              letterSpacing: "3px",
              opacity: 0.6,
            }}
          >
            [ SECTOR {idx + 1} // Z: {depth}M ]
          </div>
          <div
            style={{
              fontFamily: oswald.fontFamily,
              fontSize: 14,
              color: "#64748b",
              letterSpacing: "2px",
              opacity: 0.5,
            }}
          >
            LAT: {(14.5 + idx * 0.12).toFixed(2)}°N // LONG: {(121.0 - idx * 0.08).toFixed(2)}°E
          </div>
        </div>
      ))}
    </div>
  );
};
