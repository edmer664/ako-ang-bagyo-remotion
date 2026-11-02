import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Lightning } from "./components/Lightning";
import { SpatialWorld } from "./components/SpatialWorld";
import { StormAtmosphere } from "./components/StormAtmosphere";
import { ThreeBackgroundMonolith } from "./components/ThreeBackgroundMonolith";
import { ThreeStormAtmosphere } from "./components/ThreeStormAtmosphere";
import {
  FPS,
  getActiveLineIndex,
  getCameraForFrame,
  LYRICS,
  TOTAL_FRAMES,
} from "./lyricsData";

export const AkoAngBagyoComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeSec = frame / fps;

  // Active line index and data
  const activeIndex = useMemo(() => {
    return getActiveLineIndex(currentTimeSec);
  }, [currentTimeSec]);

  const activeLine = LYRICS[activeIndex];

  // 3D Camera coordinates for this exact frame
  const camera = useMemo(() => {
    return getCameraForFrame(frame, fps);
  }, [frame, fps]);

  // Section accent color
  const accentColor = useMemo(() => {
    switch (activeLine.section) {
      case "prechorus":
        return "#ff3b30";
      case "chorus":
      case "chorus2":
      case "outro":
        return "#00f0ff";
      case "bridge":
        return "#c084fc";
      default:
        return "#38bdf8";
    }
  }, [activeLine.section]);

  // Lightning active flag for atmosphere ambient lighting
  const isLightningActive = useMemo(() => {
    const activeLightningLine = LYRICS.find((l) => {
      if (!l.hasLightning) return false;
      const startF = Math.round(l.startSec * fps);
      return frame >= startF && frame <= startF + 14;
    });
    return !!activeLightningLine;
  }, [frame, fps]);

  // Dynamic Camera Shake on impact
  const shakeOffset = useMemo(() => {
    if (!activeLine || !activeLine.shakeIntensity) {
      return { x: 0, y: 0, r: 0 };
    }

    const lineStartFrame = Math.round(activeLine.startSec * fps);
    const localF = frame - lineStartFrame;

    // Decay shake over 16 frames after line begins
    if (localF < 0 || localF > 16) {
      return { x: 0, y: 0, r: 0 };
    }

    const decay = (16 - localF) / 16;
    const intensity = activeLine.shakeIntensity;

    const x = Math.sin(localF * 1.8) * 18 * intensity * decay;
    const y = Math.cos(localF * 2.2) * 16 * intensity * decay;
    const r = Math.sin(localF * 1.1) * 2.0 * intensity * decay;

    return { x, y, r };
  }, [activeLine, frame, fps]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020306",
        transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px) rotate(${shakeOffset.r}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Background Audio */}
      <Audio src={staticFile("audio.mp3")} />

      {/* Camera-Coupled Dynamic Storm Atmosphere */}
      <StormAtmosphere
        section={activeLine?.section || "intro"}
        camera={camera}
        accentColor={accentColor}
        isLightningActive={isLightningActive}
      />

      {/* 3D Blender Storm Monolith & Debris in Deep Atmospheric Background */}
      <ThreeBackgroundMonolith
        camera={camera}
        accentColor={accentColor}
        isLightningActive={isLightningActive}
      />

      {/* 3D Continuous World Navigation & Storyboard Parallax Elements */}
      <SpatialWorld
        camera={camera}
        activeSection={activeLine?.section || "intro"}
        activeIndex={activeIndex}
        accentColor={accentColor}
      />

      {/* Realistic 3D Volumetric Rain & Atmosphere (Three.js WebGL) */}
      <ThreeStormAtmosphere
        section={activeLine?.section || "intro"}
        camera={camera}
        accentColor={accentColor}
        isLightningActive={isLightningActive}
      />

      {/* Lightning Strike Sequences */}
      {LYRICS.map((line) => {
        if (!line.hasLightning) return null;
        const fromFrame = Math.round(line.startSec * fps);
        return (
          <Sequence
            key={`lightning-${line.id}`}
            from={fromFrame}
            durationInFrames={20}
          >
            <Lightning intensity={1.3} color={accentColor} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="AkoAngBagyo"
      component={AkoAngBagyoComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
