import React, { useMemo } from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LYRICS, LyricLine, SpatialCoord } from "../lyricsData";
import { KineticAnimator } from "./KineticAnimators";
import { WorldParallaxElements } from "./WorldParallaxElements";

interface SpatialWorldProps {
  accentColor: string;
}

export const SpatialWorld: React.FC<SpatialWorldProps> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeSec = frame / fps;

  // Find active line index
  const activeIndex = useMemo(() => {
    const idx = LYRICS.findIndex(
      (line) =>
        currentTimeSec >= line.startSec && currentTimeSec < line.endSec
    );
    return idx === -1 ? 0 : idx;
  }, [currentTimeSec]);

  // Compute smooth camera position in 3D world
  const camera = useMemo<SpatialCoord>(() => {
    const currentLine = LYRICS[activeIndex];
    const prevLine: LyricLine =
      activeIndex > 0 ? LYRICS[activeIndex - 1] : currentLine;

    const startF = Math.round(currentLine.startSec * fps);
    const localF = frame - startF;

    // Transition duration from prev waypoint to current
    const transDuration = Math.min(14, Math.floor((currentLine.endSec - currentLine.startSec) * fps * 0.4));

    const transProgress = interpolate(localF, [0, transDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Subtle drift during hold
    const drift = (localF / fps) * 15;

    return {
      x: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.x, currentLine.camera.x]
      ),
      y: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.y, currentLine.camera.y]
      ),
      z: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.z, currentLine.camera.z]
      ) - drift,
      rx: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.rx, currentLine.camera.rx]
      ),
      ry: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.ry, currentLine.camera.ry]
      ),
      rz: interpolate(
        transProgress,
        [0, 1],
        [prevLine.camera.rz, currentLine.camera.rz]
      ),
    };
  }, [activeIndex, frame, fps]);

  // Visible window of lyric items (render surrounding lines for parallax)
  const visibleLines = useMemo(() => {
    const startIdx = Math.max(0, activeIndex - 1);
    const endIdx = Math.min(LYRICS.length - 1, activeIndex + 2);
    return LYRICS.slice(startIdx, endIdx + 1);
  }, [activeIndex]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      {/* 3D World Transformation Matrix */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `
            rotateZ(${-camera.rz}deg)
            rotateX(${-camera.rx}deg)
            rotateY(${-camera.ry}deg)
            translate3d(${-camera.x}px, ${-camera.y}px, ${-camera.z}px)
          `,
        }}
      >
        {/* Parallax Ground Grid & Waypoint Markers */}
        <WorldParallaxElements accentColor={accentColor} />

        {/* 3D Positioned Lyric Waypoints */}
        {visibleLines.map((line) => {
          const isCurrent = line.id === LYRICS[activeIndex]?.id;
          const pos = line.camera;

          // Fade out distant past/future cards
          const lineStartF = Math.round(line.startSec * fps);
          const lineEndF = Math.round(line.endSec * fps);
          const isFarPast = frame > lineEndF + 15;
          const isFarFuture = frame < lineStartF - 15;

          if (isFarPast || isFarFuture) return null;

          return (
            <div
              key={line.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1920,
                height: 1080,
                marginLeft: -960,
                marginTop: -540,
                transformStyle: "preserve-3d",
                transform: `
                  translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)
                  rotateY(${pos.ry}deg)
                  rotateX(${pos.rx}deg)
                  rotateZ(${pos.rz}deg)
                `,
                opacity: isCurrent ? 1 : 0.25,
                filter: isCurrent ? "none" : "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <KineticAnimator line={line} accentColor={accentColor} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
