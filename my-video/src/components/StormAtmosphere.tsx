import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface StormAtmosphereProps {
  section: string;
  globalTimeSec: number;
}

export const StormAtmosphere: React.FC<StormAtmosphereProps> = ({
  section,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Color grading per section
  const sectionColors = useMemo(() => {
    switch (section) {
      case "prechorus":
        return {
          bg1: "#1a080d",
          bg2: "#070204",
          accent: "#ff3b30",
          glow: "rgba(255, 59, 48, 0.12)",
        };
      case "chorus":
      case "chorus2":
      case "outro":
        return {
          bg1: "#061324",
          bg2: "#02050b",
          accent: "#00f0ff",
          glow: "rgba(0, 240, 255, 0.14)",
        };
      case "bridge":
        return {
          bg1: "#12061e",
          bg2: "#040208",
          accent: "#c084fc",
          glow: "rgba(192, 132, 252, 0.12)",
        };
      case "verse1":
      case "verse2":
      default:
        return {
          bg1: "#07101c",
          bg2: "#020408",
          accent: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.10)",
        };
    }
  }, [section]);

  // Rain particles generated deterministically
  const rainDrops = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      speed: 18 + ((i * 7) % 28),
      length: 70 + ((i * 13) % 90),
      opacity: 0.12 + ((i * 9) % 35) / 100,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: sectionColors.bg2,
        backgroundImage: `radial-gradient(ellipse at 50% 40%, ${sectionColors.bg1} 0%, ${sectionColors.bg2} 85%)`,
        overflow: "hidden",
      }}
    >
      {/* Ambient Pulsing Storm Glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          width: 1400,
          height: 800,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${sectionColors.glow} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Diagonal Rain Streaks */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {rainDrops.map((drop, idx) => {
          const yPos = ((frame * drop.speed + idx * 80) % (height + 250)) - 100;
          const xPos = ((drop.x / 100) * width + (frame * 4)) % width;
          return (
            <line
              key={idx}
              x1={xPos}
              y1={yPos}
              x2={xPos - drop.length * 0.35}
              y2={yPos + drop.length}
              stroke={sectionColors.accent}
              strokeWidth={1.5}
              strokeOpacity={drop.opacity}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Atmospheric Fog / Dark Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(2, 4, 8, 0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
