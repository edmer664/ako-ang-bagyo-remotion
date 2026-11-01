import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { LYRICS, SpatialCoord } from "../lyricsData";
import { KineticAnimator } from "./KineticAnimators";
import { WorldParallaxElements } from "./WorldParallaxElements";

interface SpatialWorldProps {
  camera: SpatialCoord;
  activeSection: string;
  activeIndex: number;
  accentColor: string;
}

export const SpatialWorld: React.FC<SpatialWorldProps> = ({
  camera,
  activeSection,
  activeIndex,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        {/* Parallax Scene Elements matching the Storyboard */}
        <WorldParallaxElements
          accentColor={accentColor}
          cameraZ={camera.z}
          frame={frame}
          activeSection={activeSection}
        />

        {/* 3D Positioned Lyric Waypoints */}
        {visibleLines.map((line) => {
          const isCurrent = line.id === LYRICS[activeIndex]?.id;
          const pos = line.camera;

          const lineStartF = Math.round(line.startSec * fps);
          const lineEndF = Math.round(line.endSec * fps);
          const localFrame = frame - lineStartF;
          const lineDuration = lineEndF - lineStartF;

          // Fade out distant past/future cards
          const isFarPast = frame > lineEndF + 20;
          const isFarFuture = frame < lineStartF - 20;

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
                filter: isCurrent ? "none" : "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <KineticAnimator
                line={line}
                localFrame={localFrame}
                lineDuration={lineDuration}
                accentColor={accentColor}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
