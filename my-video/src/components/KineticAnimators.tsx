import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { FINE_WORD_DATA, KineticOrientation, TimedWord } from "../fineWordsData";
import { montserrat, oswald } from "../fonts";
import { LyricLine } from "../lyricsData";

interface KineticProps {
  line: LyricLine;
  localFrame: number;
  lineDuration: number;
  accentColor: string;
}

export const KineticAnimator: React.FC<KineticProps> = ({
  line,
  localFrame,
  lineDuration,
  accentColor,
}) => {
  const { fps } = useVideoConfig();

  // If before line starts, stay hidden
  if (localFrame < -5) return null;

  // Retrieve fine-grained word timings and layout orientation from Google Gemini audio intelligence
  const wordData = FINE_WORD_DATA[line.id];
  const orientation: KineticOrientation = wordData?.orientation || "horizontal";

  const timedWords: TimedWord[] =
    wordData?.words && wordData.words.length > 0
      ? wordData.words
      : line.text.split(" ").filter(Boolean).map((w, idx, arr) => {
          const segDuration = (line.endSec - line.startSec) / arr.length;
          return {
            word: w,
            startSec: line.startSec + idx * segDuration,
            endSec: line.startSec + (idx + 1) * segDuration,
            isEmphasis: line.emphasisWords.some((emp) =>
              w.toUpperCase().includes(emp.toUpperCase())
            ),
          };
        });

  const currentSec = line.startSec + localFrame / fps;

  // Global exit fade when nearing the end of the line
  const exitProgress = interpolate(
    localFrame,
    [lineDuration - 8, lineDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const containerOpacity = 1 - exitProgress;
  const containerScale = interpolate(exitProgress, [0, 1], [1, 0.96]);

  // Clean translation subtitle renderer
  const renderTranslation = (delay = 4) => {
    const transOpacity = interpolate(
      localFrame,
      [delay, delay + 8],
      [0, 0.85],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const transY = interpolate(
      localFrame,
      [delay, delay + 8],
      [15, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }
    );

    return (
      <div
        style={{
          fontFamily: oswald.fontFamily,
          fontSize: 22,
          fontWeight: 600,
          color: "#94a3b8",
          letterSpacing: "3px",
          textTransform: "uppercase",
          opacity: transOpacity,
          transform: `translateY(${transY}px)`,
          textAlign: "center",
          maxWidth: 1300,
          marginTop: 14,
        }}
      >
        {line.translation}
      </div>
    );
  };

  // Helper to render individual fine-grained words
  const renderWord = (
    w: TimedWord,
    idx: number,
    total: number,
    extraTransform = ""
  ) => {
    const wordStartF = Math.round((w.startSec - line.startSec) * fps);
    const wordLocalF = localFrame - wordStartF;
    const isWordSung = localFrame >= wordStartF;
    const isWordActive =
      currentSec >= w.startSec - 0.05 && currentSec <= w.endSec + 0.08;
    const isWordPast = currentSec > w.endSec + 0.08;

    // Word entrance pop based on exact vocal onset
    const wordSpring = spring({
      frame: wordLocalF,
      fps,
      config: { damping: 13, stiffness: 220, mass: 0.6 },
    });

    const translateY = interpolate(wordSpring, [0, 1], [50, 0]);
    const wordScale = interpolate(wordSpring, [0, 1], [0.82, 1]);
    const activeScale = isWordActive ? 1.08 : 1.0;

    // Opacity: subtle ghost before singing (0.2), popping to full 1.0 on sing
    const wordOpacity = isWordSung
      ? interpolate(wordLocalF, [0, 3], [0.3, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0.2;

    const emp =
      w.isEmphasis ||
      line.emphasisWords.some((e) =>
        w.word.toUpperCase().includes(e.toUpperCase())
      );

    const wordColor = isWordActive
      ? emp
        ? "#ffffff"
        : accentColor
      : emp
      ? accentColor
      : isWordPast
      ? "#ffffff"
      : "rgba(255, 255, 255, 0.4)";

    const wordBg = emp
      ? isWordActive
        ? accentColor
        : "rgba(255, 255, 255, 0.12)"
      : "transparent";

    const wordGlow = isWordActive
      ? `0 0 35px ${accentColor}, 0 0 70px ${accentColor}80`
      : emp
      ? `0 0 25px ${accentColor}60`
      : "none";

    const fontSize =
      orientation === "vertical-stack"
        ? total <= 4
          ? 96
          : 74
        : orientation === "monolith-center"
        ? total <= 4
          ? 120
          : 90
        : total <= 4
        ? 92
        : 74;

    return (
      <span
        key={`word-${idx}`}
        style={{
          display: "inline-block",
          overflow: "hidden",
          padding: emp ? "6px 16px" : "2px 8px",
          borderRadius: 6,
          backgroundColor: wordBg,
          boxShadow: emp && isWordActive ? `0 0 40px ${accentColor}` : "none",
          border: emp ? `2px solid ${accentColor}` : "none",
          transform: `${extraTransform} scale(${
            wordScale * activeScale
          }) translateY(${translateY}px)`,
          opacity: wordOpacity,
          transition: "transform 0.1s ease-out, background-color 0.15s ease",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: montserrat.fontFamily,
            fontSize,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: wordColor,
            textShadow: wordGlow,
          }}
        >
          {w.word}
        </span>
      </span>
    );
  };

  // =========================================================================
  // ORIENTATION 1: VERTICAL-STACK (Poster Column Layout)
  // =========================================================================
  if (orientation === "vertical-stack") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: containerOpacity,
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {timedWords.map((w, i) => renderWord(w, i, timedWords.length))}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 2: DIAGONAL-UP (Ascending Velocity Tilt -10deg)
  // =========================================================================
  if (orientation === "diagonal-up") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: containerOpacity,
          transform: `rotate(-10deg) skewX(-4deg) scale(${containerScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px 18px",
            maxWidth: 1450,
          }}
        >
          {timedWords.map((w, i) => renderWord(w, i, timedWords.length))}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 3: DIAGONAL-DOWN (Descending Cascade Tilt +10deg)
  // =========================================================================
  if (orientation === "diagonal-down") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: containerOpacity,
          transform: `rotate(10deg) skewX(4deg) scale(${containerScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px 18px",
            maxWidth: 1450,
          }}
        >
          {timedWords.map((w, i) => renderWord(w, i, timedWords.length))}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 4: SPLIT-FLANK (Two Opposing Groups Converging Inward)
  // =========================================================================
  if (orientation === "split-flank") {
    const half = Math.ceil(timedWords.length / 2);
    const leftWords = timedWords.slice(0, half);
    const rightWords = timedWords.slice(half);

    const convergeSpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 14, stiffness: 180, mass: 0.7 },
    });

    const leftX = interpolate(convergeSpring, [0, 1], [-80, 0]);
    const rightX = interpolate(convergeSpring, [0, 1], [80, 0]);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: containerOpacity,
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            maxWidth: 1500,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 16px",
              transform: `translateX(${leftX}px)`,
            }}
          >
            {leftWords.map((w, i) => renderWord(w, i, timedWords.length))}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 16px",
              transform: `translateX(${rightX}px)`,
            }}
          >
            {rightWords.map((w, i) =>
              renderWord(w, half + i, timedWords.length)
            )}
          </div>
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 5: CROSS-TILT (Alternating 3D Perspective Angular Tilt)
  // =========================================================================
  if (orientation === "cross-tilt") {
    const jitterX = Math.sin(localFrame * 2.5) * 3;
    const jitterY = Math.cos(localFrame * 3.1) * 2;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `translate(${jitterX}px, ${jitterY}px) scale(${containerScale})`,
          opacity: containerOpacity,
          perspective: "800px",
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px 22px",
            maxWidth: 1500,
            transformStyle: "preserve-3d",
          }}
        >
          {timedWords.map((w, i) => {
            const rotY = i % 2 === 0 ? -16 : 16;
            const rotZ = i % 2 === 0 ? -3 : 3;
            return renderWord(
              w,
              i,
              timedWords.length,
              `rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
            );
          })}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 6: MONOLITH-CENTER (Monumental Massive Scale Typography)
  // =========================================================================
  if (orientation === "monolith-center") {
    const monolithSpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 14, stiffness: 200, mass: 0.7 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `scale(${monolithSpring * containerScale})`,
          opacity: containerOpacity,
        }}
      >
        <div
          aria-label={line.text}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px 24px",
            maxWidth: 1600,
          }}
        >
          {timedWords.map((w, i) => renderWord(w, i, timedWords.length))}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // =========================================================================
  // ORIENTATION 7: HORIZONTAL (Standard Clean Display Typography Banner)
  // =========================================================================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
      }}
    >
      <div
        aria-label={line.text}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 18px",
          maxWidth: 1450,
        }}
      >
        {timedWords.map((w, i) => renderWord(w, i, timedWords.length))}
      </div>
      {renderTranslation(4)}
    </div>
  );
};
