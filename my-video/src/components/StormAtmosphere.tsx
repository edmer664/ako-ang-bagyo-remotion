import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { oswald } from "../fonts";

interface StormAtmosphereProps {
  section: string;
  globalTimeSec: number;
}

export const StormAtmosphere: React.FC<StormAtmosphereProps> = ({
  section,
  globalTimeSec,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Color grading per section
  const sectionColors = useMemo(() => {
    switch (section) {
      case "prechorus":
        return {
          bg1: "#120914",
          bg2: "#070308",
          accent: "#ff3b30",
          gridColor: "rgba(255, 59, 48, 0.08)",
        };
      case "chorus":
      case "chorus2":
      case "outro":
        return {
          bg1: "#070b14",
          bg2: "#020306",
          accent: "#00f0ff",
          gridColor: "rgba(0, 240, 255, 0.09)",
        };
      case "bridge":
        return {
          bg1: "#0b0612",
          bg2: "#030205",
          accent: "#c084fc",
          gridColor: "rgba(192, 132, 252, 0.08)",
        };
      case "verse1":
      case "verse2":
      default:
        return {
          bg1: "#080c14",
          bg2: "#020408",
          accent: "#38bdf8",
          gridColor: "rgba(56, 189, 248, 0.07)",
        };
    }
  }, [section]);

  // Rain particles generated deterministically
  const rainDrops = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      speed: 15 + ((i * 7) % 25),
      length: 60 + ((i * 13) % 80),
      opacity: 0.15 + ((i * 9) % 45) / 100,
    }));
  }, []);

  // Equalizer visualizer bars
  const eqBars = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => i);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: sectionColors.bg2,
        backgroundImage: `radial-gradient(circle at 50% 45%, ${sectionColors.bg1} 0%, ${sectionColors.bg2} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Perspective Grid Background (Alight Motion / Motion Graphic style) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, ${sectionColors.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${sectionColors.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: `${(frame * 0.4) % 80}px ${(frame * 0.4) % 80}px`,
          opacity: 0.8,
        }}
      />

      {/* Rotating Radar / Storm Gyre in Center Background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          transform: `translate(-50%, -50%) rotate(${frame * 0.35}deg)`,
          borderRadius: "50%",
          border: `1px dashed ${sectionColors.gridColor}`,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 500,
            height: 500,
            transform: `translate(-50%, -50%) rotate(${-frame * 0.7}deg)`,
            borderRadius: "50%",
            border: `1px solid ${sectionColors.gridColor}`,
          }}
        />
        {/* Radar crosshair sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "50%",
            height: "50%",
            background: `conic-gradient(from 0deg at 0% 100%, ${sectionColors.accent}20 0deg, transparent 60deg)`,
            transformOrigin: "bottom left",
          }}
        />
      </div>

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
          const yPos = ((frame * drop.speed + idx * 80) % (height + 200)) - 100;
          const xPos = ((drop.x / 100) * width + (frame * 3)) % width;
          return (
            <line
              key={idx}
              x1={xPos}
              y1={yPos}
              x2={xPos - drop.length * 0.3}
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
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 4, 8, 0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* --- HUD MOTION GRAPHIC ELEMENTS --- */}

      {/* Top Left: Track & Artist Info */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontFamily: oswald.fontFamily,
          color: "#ffffff",
          letterSpacing: "3px",
          fontSize: 14,
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              backgroundColor: sectionColors.accent,
              boxShadow: `0 0 10px ${sectionColors.accent}`,
              borderRadius: "50%",
            }}
          />
          <span style={{ fontWeight: 700, color: sectionColors.accent }}>
            SHEAN // AKO ANG BAGYO
          </span>
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12 }}>
          SYS.ID: TYPHOON-KINETIC-01
        </div>
      </div>

      {/* Top Right: Timecode & Status Badge */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          fontFamily: oswald.fontFamily,
          letterSpacing: "2px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            padding: "4px 12px",
            backgroundColor: `${sectionColors.accent}25`,
            border: `1px solid ${sectionColors.accent}`,
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 700,
            color: sectionColors.accent,
            boxShadow: `0 0 15px ${sectionColors.accent}40`,
          }}
        >
          {section.toUpperCase()} // ACTIVE
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>
          TC: {Math.floor(globalTimeSec / 60).toString().padStart(2, "0")}:
          {Math.floor(globalTimeSec % 60).toString().padStart(2, "0")}:
          {Math.floor((globalTimeSec * 30) % 30).toString().padStart(2, "0")}
        </div>
      </div>

      {/* Bottom Center: Audio Equalizer Waveform Simulation */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          height: 36,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      >
        {eqBars.map((barIndex) => {
          // Rhythmic procedural bounce
          const bounce = Math.abs(
            Math.sin(frame * 0.15 + barIndex * 0.3) *
              Math.cos(frame * 0.08 - barIndex * 0.2)
          );
          const barHeight = 6 + bounce * 28;
          return (
            <div
              key={barIndex}
              style={{
                width: 4,
                height: `${barHeight}px`,
                backgroundColor:
                  barIndex % 6 === 0 ? "#ffffff" : sectionColors.accent,
                borderRadius: 2,
                boxShadow:
                  bounce > 0.7 ? `0 0 8px ${sectionColors.accent}` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Bottom Left & Right Framing Brackets */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          fontFamily: oswald.fontFamily,
          fontSize: 12,
          color: "#64748b",
          letterSpacing: "1px",
        }}
      >
        [ 4K UHD // 30 FPS ]
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          fontFamily: oswald.fontFamily,
          fontSize: 12,
          color: "#64748b",
          letterSpacing: "1px",
        }}
      >
        [ KINETIC TYPOGRAPHY ]
      </div>
    </div>
  );
};
