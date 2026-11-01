import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SpatialCoord } from "../lyricsData";

interface StormAtmosphereProps {
  section: string;
  camera: SpatialCoord;
  accentColor: string;
  isLightningActive?: boolean;
}

export const StormAtmosphere: React.FC<StormAtmosphereProps> = ({
  section,
  camera,
  accentColor,
  isLightningActive = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Color grading per section matching the Storyboard
  const sectionColors = useMemo(() => {
    switch (section) {
      case "prechorus":
        return {
          bg1: "#240a12",
          bg2: "#070204",
          accent: "#ff3b30",
          glow: "rgba(255, 59, 48, 0.22)",
          cloudTone: "rgba(255, 59, 48, 0.12)",
          windSpeedMultiplier: 1.4,
        };
      case "chorus":
      case "chorus2":
        return {
          bg1: "#061830",
          bg2: "#020710",
          accent: "#00f0ff",
          glow: "rgba(0, 240, 255, 0.25)",
          cloudTone: "rgba(0, 240, 255, 0.14)",
          windSpeedMultiplier: 1.8,
        };
      case "bridge":
        return {
          bg1: "#160726",
          bg2: "#04020a",
          accent: "#c084fc",
          glow: "rgba(192, 132, 252, 0.20)",
          cloudTone: "rgba(192, 132, 252, 0.10)",
          windSpeedMultiplier: 0.8,
        };
      case "outro":
        return {
          bg1: "#0a223d",
          bg2: "#020812",
          accent: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.30)",
          cloudTone: "rgba(56, 189, 248, 0.18)",
          windSpeedMultiplier: 2.2,
        };
      case "verse1":
      case "verse2":
      default:
        return {
          bg1: "#091322",
          bg2: "#02050b",
          accent: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.15)",
          cloudTone: "rgba(56, 189, 248, 0.08)",
          windSpeedMultiplier: 1.0,
        };
    }
  }, [section]);

  // Rain particles generated deterministically
  const rainDrops = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      speed: 20 + ((i * 7) % 25),
      length: 80 + ((i * 13) % 100),
      opacity: 0.15 + ((i * 9) % 35) / 100,
    }));
  }, []);

  // Wind speed streaks for Chorus / Tempest scenes
  const windStreaks = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      y: ((i * 93) % 100),
      speed: 35 + ((i * 11) % 40),
      length: 300 + ((i * 29) % 400),
      opacity: 0.1 + ((i * 7) % 25) / 100,
    }));
  }, []);

  // 3D Parallax offsets calculated from camera orientation & translation
  const bgShiftX = -camera.x * 0.04;
  const bgShiftY = -camera.y * 0.04;
  const bgRoll = -camera.rz * 0.35;
  const bgTiltX = -camera.rx * 0.4;
  const bgPanY = -camera.ry * 0.4;

  const stormVortexRotation = frame * 0.25;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: sectionColors.bg2,
        overflow: "hidden",
      }}
    >
      {/* Deep Atmospheric Storm Nebula / Vortex (Rotates & Parallaxes with Camera) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: width * 1.8,
          height: height * 1.8,
          transform: `
            translate(-50%, -50%)
            translate(${bgShiftX + bgPanY}px, ${bgShiftY + bgTiltX}px)
            rotate(${bgRoll + stormVortexRotation}deg)
          `,
          backgroundImage: `radial-gradient(ellipse at 50% 50%, ${sectionColors.bg1} 0%, ${sectionColors.bg2} 70%)`,
          opacity: 0.95,
          pointerEvents: "none",
        }}
      >
        {/* Dynamic Storm Cloud Swirl Shapes in Background */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "25%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 40% 40%, ${sectionColors.cloudTone} 0%, transparent 65%)`,
            filter: "blur(50px)",
            transform: `rotate(${frame * 0.1}deg) scale(1.3)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "40%",
            width: "45%",
            height: "45%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 60% 60%, ${sectionColors.glow} 0%, transparent 70%)`,
            filter: "blur(70px)",
            transform: `rotate(${-frame * 0.15}deg)`,
          }}
        />
      </div>

      {/* Lightning Flash Ambient Illumination */}
      {isLightningActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: accentColor,
            opacity: 0.22,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Horizontal Hurricane Wind Streaks (Active during Chorus & Outro) */}
      {(section === "chorus" || section === "chorus2" || section === "outro") && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            transform: `translate(${bgShiftX * 0.5}px, ${bgShiftY * 0.5}px) rotate(${bgRoll * 0.5}deg)`,
          }}
        >
          {windStreaks.map((w, idx) => {
            const xPos =
              ((frame * w.speed * sectionColors.windSpeedMultiplier + idx * 250) %
                (width + w.length * 2)) -
              w.length;
            const yPos = (w.y / 100) * height;
            return (
              <line
                key={`wind-${idx}`}
                x1={xPos}
                y1={yPos}
                x2={xPos + w.length}
                y2={yPos - 15}
                stroke={accentColor}
                strokeWidth={1.5}
                strokeOpacity={w.opacity}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      )}

      {/* 3D Diagonal Rain Streaks (React to camera roll & velocity) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          transform: `translate(${bgShiftX}px, ${bgShiftY}px) rotate(${bgRoll * 0.4}deg)`,
        }}
      >
        {rainDrops.map((drop, idx) => {
          const yPos =
            ((frame * drop.speed * sectionColors.windSpeedMultiplier + idx * 80) %
              (height + 250)) -
            100;
          const xPos =
            ((drop.x / 100) * width + (frame * 5 * sectionColors.windSpeedMultiplier)) %
            width;
          return (
            <line
              key={`rain-${idx}`}
              x1={xPos}
              y1={yPos}
              x2={xPos - drop.length * 0.4}
              y2={yPos + drop.length}
              stroke={sectionColors.accent}
              strokeWidth={1.5}
              strokeOpacity={drop.opacity}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Atmospheric Fog & Dark Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(2, 4, 8, 0.90) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
