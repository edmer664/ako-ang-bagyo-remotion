import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
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

  const words = line.text.split(" ").filter(Boolean);

  const isEmphasized = (w: string) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return line.emphasisWords.some((emp) =>
      clean.includes(emp.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
    );
  };

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
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
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
          maxWidth: 1200,
          marginTop: 8,
        }}
      >
        {line.translation}
      </div>
    );
  };

  // --- 1. MASK WIPE (Skill standard: overflow: hidden, translateY 110% -> 0) ---
  if (line.animStyle === "mask-wipe") {
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
            gap: "8px 18px",
            maxWidth: 1400,
          }}
        >
          {words.map((w, i) => {
            const p = spring({
              frame: localFrame - i * 2,
              fps,
              config: { damping: 14, stiffness: 140, mass: 0.6 },
            });
            const y = interpolate(p, [0, 1], [115, 0]);
            const emp = isEmphasized(w);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  padding: "4px 10px",
                  borderRadius: 6,
                  backgroundColor: emp ? accentColor : "transparent",
                  color: emp ? "#020408" : "#ffffff",
                  boxShadow: emp ? `0 0 35px ${accentColor}90` : "none",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${y}%)`,
                    fontFamily: montserrat.fontFamily,
                    fontSize: words.length <= 4 ? 88 : 72,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
        {renderTranslation(6)}
      </div>
    );
  }

  // --- 2. CHAR STAGGER (Per-character kinetic cascade with rotational tilt) ---
  if (line.animStyle === "char-stagger") {
    const chars = line.text.split("");
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
            maxWidth: 1500,
            fontFamily: montserrat.fontFamily,
            fontSize: chars.length > 30 ? 64 : 84,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {chars.map((ch, i) => {
            const charSpring = spring({
              frame: localFrame - i * 0.9,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const y = interpolate(charSpring, [0, 1], [80, 0]);
            const rot = interpolate(charSpring, [0, 1], [i % 2 === 0 ? -12 : 12, 0]);

            return (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transform: `translateY(${y}px) rotate(${rot}deg)`,
                  opacity: charSpring,
                  color: "#ffffff",
                  textShadow: `0 8px 30px rgba(0,0,0,0.9)`,
                  whiteSpace: "pre",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {renderTranslation(8)}
      </div>
    );
  }

  // --- 3. BLUR FOCUS (Focus pull with tracking expansion) ---
  if (line.animStyle === "blur-focus") {
    const blurAmount = interpolate(localFrame, [0, 10], [24, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    const opacity = interpolate(localFrame, [0, 8], [0, 1], {
      extrapolateRight: "clamp",
    });
    const tracking = interpolate(localFrame, [0, 16], [8, -1], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: opacity * containerOpacity,
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: words.length <= 4 ? 96 : 74,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: `${tracking}px`,
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.15,
            textShadow: `0 0 35px ${accentColor}80`,
          }}
        >
          {line.text}
        </div>
        {renderTranslation(6)}
      </div>
    );
  }

  // --- 4. DIZZY ORBIT (Rolling kinetic typography for "nahilo" / dizziness) ---
  if (line.animStyle === "dizzy-orbit") {
    const entrance = spring({
      frame: localFrame,
      fps,
      config: { damping: 14, stiffness: 120 },
    });
    const wobble = Math.sin(localFrame * 0.15) * 4;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: containerOpacity,
          transform: `rotate(${wobble}deg) scale(${entrance * containerScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
            maxWidth: 1500,
          }}
        >
          {words.map((w, i) => {
            const emp = isEmphasized(w);
            const wordDelay = i * 1.5;
            const wordPop = spring({
              frame: localFrame - wordDelay,
              fps,
              config: { damping: 12, stiffness: 160 },
            });
            const wordRot = interpolate(wordPop, [0, 1], [(i % 2 === 0 ? -1 : 1) * 15, 0]);

            return (
              <div
                key={i}
                style={{
                  fontFamily: montserrat.fontFamily,
                  fontSize: emp ? 88 : 74,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: emp ? accentColor : "#ffffff",
                  transform: `scale(${wordPop}) rotate(${wordRot}deg)`,
                  textShadow: emp
                    ? `0 0 40px ${accentColor}`
                    : "0 5px 25px rgba(0,0,0,0.8)",
                  letterSpacing: "-0.02em",
                  padding: emp ? "4px 14px" : "0",
                  backgroundColor: emp ? `${accentColor}18` : "transparent",
                  border: emp ? `2px solid ${accentColor}` : "none",
                  borderRadius: 8,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
        {renderTranslation(6)}
      </div>
    );
  }

  // --- 5. ROOFTOP TEAR (Hurricane wind tearing roof plates: "Tatangayin ko bawat yero") ---
  if (line.animStyle === "rooftop-tear") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: containerOpacity,
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "14px 22px",
            maxWidth: 1500,
            perspective: 800,
          }}
        >
          {words.map((w, i) => {
            const tearProgress = spring({
              frame: localFrame - i * 1.8,
              fps,
              config: { damping: 13, stiffness: 180, mass: 0.7 },
            });
            const rotX = interpolate(tearProgress, [0, 1], [-65, 0]);
            const rotZ = interpolate(
              tearProgress,
              [0, 1],
              [i % 2 === 0 ? -25 : 25, 0]
            );
            const emp = isEmphasized(w);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
                  backgroundColor: emp ? accentColor : "rgba(255,255,255,0.08)",
                  border: `2px solid ${
                    emp ? "#ffffff" : "rgba(255,255,255,0.2)"
                  }`,
                  color: emp ? "#020408" : "#ffffff",
                  fontFamily: montserrat.fontFamily,
                  fontSize: words.length <= 4 ? 88 : 74,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  padding: "8px 22px",
                  borderRadius: 6,
                  boxShadow: emp ? `0 0 45px ${accentColor}` : "none",
                  letterSpacing: "-0.02em",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {renderTranslation(6)}
      </div>
    );
  }

  // --- 6. HAZARD MONOLITH (High-voltage alert: "MATAKOT NA KAYO") ---
  if (line.animStyle === "hazard-monolith") {
    const pop = spring({
      frame: localFrame,
      fps,
      config: { damping: 14, stiffness: 180, mass: 0.7 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `scale(${pop * containerScale})`,
          opacity: containerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: words.length <= 4 ? 108 : 80,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: `0 0 35px ${accentColor}, 0 0 70px ${accentColor}60`,
          }}
        >
          {words.map((w, i) => {
            const emp = isEmphasized(w);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  margin: "0 10px",
                  color: emp ? accentColor : "#ffffff",
                  borderBottom: emp ? `6px solid ${accentColor}` : "none",
                  paddingBottom: 4,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // --- 7. MEMORY POLAROID (Verse 2: "Itinago na litrato") ---
  if (line.animStyle === "memory-polaroid") {
    const slide = spring({
      frame: localFrame,
      fps,
      config: { damping: 16, stiffness: 150, mass: 0.7 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transform: `rotate(${interpolate(
            slide,
            [0, 1],
            [-10, -2]
          )}deg) scale(${slide * containerScale})`,
          opacity: containerOpacity,
          padding: "24px 44px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: 8,
          boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
          maxWidth: 950,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 72,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          {line.text}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 22,
            fontWeight: 600,
            color: "#64748b",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          {line.translation}
        </div>
      </div>
    );
  }

  // --- 8. WALL DEMOLITION (Chorus 2: "Gigibain ko mga pader n'yo") ---
  if (line.animStyle === "wall-demolition") {
    const crash = spring({
      frame: localFrame,
      fps,
      config: { damping: 12, stiffness: 220, mass: 0.8 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `scale(${crash * containerScale})`,
          opacity: containerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 92,
            fontWeight: 900,
            color: "#ffffff",
            backgroundColor: "#ff3b30",
            padding: "14px 42px",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            boxShadow: "0 0 60px #ff3b30",
            borderRadius: 6,
          }}
        >
          {line.text}
        </div>
        {renderTranslation(4)}
      </div>
    );
  }

  // --- 9. LIGHTNING SHATTER (Electric Climax: "AKO ANG BAGYO" / Thunder drops) ---
  const jitterX = Math.sin(localFrame * 2.5) * 3;
  const jitterY = Math.cos(localFrame * 3.1) * 2;
  const flash = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.5 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translate(${jitterX}px, ${jitterY}px) scale(${
          flash * containerScale
        })`,
        opacity: containerOpacity,
      }}
    >
      <div
        style={{
          fontFamily: montserrat.fontFamily,
          fontSize: words.length <= 4 ? 124 : 92,
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          textAlign: "center",
          filter: `drop-shadow(0 0 25px ${accentColor}) drop-shadow(0 0 60px ${accentColor})`,
        }}
      >
        {words.map((w, i) => {
          const emp = isEmphasized(w);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 8px",
                color: emp ? accentColor : "#ffffff",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {renderTranslation(3)}
    </div>
  );
};
