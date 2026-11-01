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

  // Dynamic 3D Parallax offsets matching true camera movement
  const bgShiftX = -camera.x * 0.16;
  const bgShiftY = -camera.y * 0.16;
  const bgRoll = -camera.rz * 0.75;
  const bgTiltX = -camera.rx * 0.75;
  const bgPanY = -camera.ry * 0.75;

  const stormVortexRotation = frame * 0.35;

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
          width: width * 2.2,
          height: height * 2.2,
          transform: `
            translate(-50%, -50%)
            translate(${bgShiftX + bgPanY}px, ${bgShiftY + bgTiltX}px)
            rotate(${bgRoll + stormVortexRotation}deg)
          `,
          backgroundImage: `radial-gradient(ellipse at 50% 50%, ${sectionColors.bg1} 0%, ${sectionColors.bg2} 65%)`,
          opacity: 0.95,
          pointerEvents: "none",
        }}
      >
        {/* Dynamic Storm Cloud Swirl Shapes in Background */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "22%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 40% 40%, ${sectionColors.cloudTone} 0%, transparent 65%)`,
            filter: "blur(60px)",
            transform: `rotate(${frame * 0.12}deg) scale(1.3)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "38%",
            width: "48%",
            height: "48%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 60% 60%, ${sectionColors.glow} 0%, transparent 70%)`,
            filter: "blur(80px)",
            transform: `rotate(${-frame * 0.18}deg)`,
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
            opacity: 0.28,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Atmospheric Fog & Dark Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2, 4, 8, 0.92) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
