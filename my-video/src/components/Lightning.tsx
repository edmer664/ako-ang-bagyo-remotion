import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface LightningProps {
  intensity?: number;
  color?: string;
}

export const Lightning: React.FC<LightningProps> = ({
  intensity = 1,
  color = "#a5f3fc",
}) => {
  const frame = useCurrentFrame();

  // Flash opacity rapidly across first few frames
  const opacity = interpolate(
    frame,
    [0, 2, 4, 7, 10, 16],
    [1, 0.2, 0.9, 0.1, 0.7, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        opacity: opacity * intensity,
      }}
    >
      {/* Full screen blinding flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: interpolate(frame, [0, 2, 6], [0.65, 0.1, 0], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* SVG Lightning Bolt 1 */}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 35px #38bdf8)`,
        }}
      >
        <path
          d="M 960 0 L 920 180 L 1000 230 L 910 420 L 970 460 L 880 650 L 940 700 L 850 1080"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Branch 1 */}
        <path
          d="M 920 180 L 820 280 L 860 320 L 780 430"
          stroke={color}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Branch 2 */}
        <path
          d="M 910 420 L 1050 510 L 1020 560 L 1110 660"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Core highlight */}
        <path
          d="M 960 0 L 920 180 L 1000 230 L 910 420 L 970 460 L 880 650 L 940 700 L 850 1080"
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
