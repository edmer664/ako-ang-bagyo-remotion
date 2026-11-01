import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { montserrat, oswald } from "../fonts";
import { LyricLine } from "../lyricsData";

interface KineticProps {
  line: LyricLine;
  accentColor: string;
}

export const KineticAnimator: React.FC<KineticProps> = ({
  line,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = line.text.split(" ").filter(Boolean);

  const isEmphasized = (w: string) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return line.emphasisWords.some((emp) =>
      clean.includes(emp.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
    );
  };

  // --- 1. MASK WIPE (Skill standard: overflow: hidden, translateY 110% -> 0) ---
  if (line.animStyle === "mask-wipe") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 18px", maxWidth: 1400 }}>
          {words.map((w, i) => {
            const p = spring({
              frame: frame - i * 2,
              fps,
              config: { damping: 200, stiffness: 180, mass: 0.6 },
            });
            const y = interpolate(p, [0, 1], [115, 0]);
            const emp = isEmphasized(w);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  padding: "4px 8px",
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
                    fontSize: 76,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 24,
            color: "#94a3b8",
            letterSpacing: "4px",
            textTransform: "uppercase",
            opacity: interpolate(frame, [4, 12], [0, 0.9], { extrapolateRight: "clamp" }),
          }}
        >
          // {line.translation}
        </div>
      </div>
    );
  }

  // --- 2. CHAR STAGGER (Remotion per-character spring cascade) ---
  if (line.animStyle === "char-stagger") {
    const chars = line.text.split("");
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
            letterSpacing: "2px",
          }}
        >
          {chars.map((ch, i) => {
            const charSpring = spring({
              frame: frame - i * 1.2,
              fps,
              config: { damping: 180, stiffness: 220, mass: 0.5 },
            });
            const y = interpolate(charSpring, [0, 1], [90, 0]);
            const rot = interpolate(charSpring, [0, 1], [i % 2 === 0 ? -15 : 15, 0]);

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
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 24,
            color: accentColor,
            letterSpacing: "4px",
            textTransform: "uppercase",
            opacity: interpolate(frame, [8, 16], [0, 0.95], { extrapolateRight: "clamp" }),
          }}
        >
          {line.translation}
        </div>
      </div>
    );
  }

  // --- 3. BLUR FOCUS (Focus pull with tracking expansion) ---
  if (line.animStyle === "blur-focus") {
    const blurAmount = interpolate(frame, [0, 10], [24, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
    const tracking = interpolate(frame, [0, 20], [12, 4], { extrapolateRight: "clamp" });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity,
          filter: `blur(${blurAmount}px)`,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: words.length <= 4 ? 92 : 70,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: `${tracking}px`,
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.2,
            textShadow: `0 0 35px ${accentColor}80`,
          }}
        >
          {line.text}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 24,
            color: "#cbd5e1",
            letterSpacing: "5px",
            textTransform: "uppercase",
          }}
        >
          [ {line.translation} ]
        </div>
      </div>
    );
  }

  // --- 4. DIZZY ORBIT (Rotating 3D carousel cylinder) ---
  if (line.animStyle === "dizzy-orbit") {
    const orbitAngle = frame * 2.2;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          perspective: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
            maxWidth: 1500,
          }}
        >
          {words.map((w, i) => {
            const wordAngle = (i / words.length) * 360 + orbitAngle;
            const emp = isEmphasized(w);
            const scale = interpolate(Math.cos((wordAngle * Math.PI) / 180), [-1, 1], [0.85, 1.15]);
            const z = Math.sin((wordAngle * Math.PI) / 180) * 80;

            return (
              <div
                key={i}
                style={{
                  fontFamily: montserrat.fontFamily,
                  fontSize: 78,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: emp ? accentColor : "#ffffff",
                  transform: `translateZ(${z}px) scale(${scale})`,
                  textShadow: emp ? `0 0 40px ${accentColor}` : "0 5px 25px rgba(0,0,0,0.8)",
                  letterSpacing: "3px",
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: oswald.fontFamily,
            fontSize: 24,
            color: "#94a3b8",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          CYCLONE AXIS // {line.translation}
        </div>
      </div>
    );
  }

  // --- 5. ROOFTOP TEAR (Wind rip / 3D skew tumble) ---
  if (line.animStyle === "rooftop-tear") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "18px 24px",
            maxWidth: 1500,
            perspective: 800,
          }}
        >
          {words.map((w, i) => {
            const tearProgress = spring({
              frame: frame - i * 2,
              fps,
              config: { damping: 140, stiffness: 240, mass: 0.7 },
            });
            const rotX = interpolate(tearProgress, [0, 1], [-70, 0]);
            const rotZ = interpolate(tearProgress, [0, 1], [i % 2 === 0 ? -35 : 35, 0]);
            const emp = isEmphasized(w);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
                  backgroundColor: emp ? "#ffffff" : "rgba(255,255,255,0.06)",
                  border: `2px solid ${emp ? accentColor : "rgba(255,255,255,0.2)"}`,
                  color: emp ? "#020408" : "#ffffff",
                  fontFamily: montserrat.fontFamily,
                  fontSize: 76,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  padding: "10px 24px",
                  borderRadius: 4,
                  boxShadow: emp ? `0 0 45px ${accentColor}` : "none",
                  letterSpacing: "3px",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 24,
            color: "#cbd5e1",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          ROOF DEBRIS // {line.translation}
        </div>
      </div>
    );
  }

  // --- 6. HAZARD MONOLITH (Warning tapes & alert block) ---
  if (line.animStyle === "hazard-monolith") {
    const pop = spring({
      frame,
      fps,
      config: { damping: 160, stiffness: 220, mass: 0.8 },
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${pop})` }}>
        {/* Warning tape */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "8px 24px",
            backgroundColor: "#ff3b30",
            color: "#ffffff",
            fontFamily: oswald.fontFamily,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "4px",
            borderRadius: 4,
            boxShadow: "0 0 30px #ff3b3090",
          }}
        >
          <span>⚠ WARNING</span>
          <span>HIGH-VOLTAGE HAZARD SECTOR</span>
          <span>⚠</span>
        </div>

        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: words.length <= 4 ? 104 : 76,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "4px",
            textAlign: "center",
            textShadow: `0 0 35px #ff3b30, 0 0 80px #ff3b3060`,
          }}
        >
          {line.text}
        </div>

        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 26,
            color: "#fca5a5",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          "{line.translation}"
        </div>
      </div>
    );
  }

  // --- 7. MEMORY POLAROID (Verse 2 photo frame) ---
  if (line.animStyle === "memory-polaroid") {
    const slide = spring({
      frame,
      fps,
      config: { damping: 190, stiffness: 180, mass: 0.7 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `rotate(${interpolate(slide, [0, 1], [-12, -3])}deg) scale(${slide})`,
          padding: "24px 40px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: 8,
          boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 68,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center",
            borderBottom: "3px solid #0f172a",
            paddingBottom: 12,
            width: "100%",
          }}
        >
          {line.text}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 22,
            color: "#64748b",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          EVIDENCE // {line.translation}
        </div>
      </div>
    );
  }

  // --- 8. WALL DEMOLITION (Chorus 2: Wall Crash) ---
  if (line.animStyle === "wall-demolition") {
    const crash = spring({
      frame,
      fps,
      config: { damping: 130, stiffness: 280, mass: 0.9 },
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `scale(${crash})`,
        }}
      >
        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 92,
            fontWeight: 900,
            color: "#ffffff",
            backgroundColor: "#ff3b30",
            padding: "12px 36px",
            textTransform: "uppercase",
            letterSpacing: "4px",
            boxShadow: "0 0 60px #ff3b30",
            borderRadius: 6,
          }}
        >
          {line.text}
        </div>
        <div
          style={{
            fontFamily: oswald.fontFamily,
            fontSize: 26,
            color: "#fca5a5",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          DEMOLITION // {line.translation}
        </div>
      </div>
    );
  }

  // --- 9. LIGHTNING SHATTER (Electric Climax) ---
  const jitterX = Math.sin(frame * 2.5) * 4;
  const jitterY = Math.cos(frame * 3.1) * 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        transform: `translate(${jitterX}px, ${jitterY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: montserrat.fontFamily,
          fontSize: words.length <= 4 ? 120 : 88,
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "6px",
          textAlign: "center",
          filter: `drop-shadow(0 0 25px ${accentColor}) drop-shadow(0 0 60px ${accentColor})`,
        }}
      >
        {line.text}
      </div>
      <div
        style={{
          fontFamily: oswald.fontFamily,
          fontSize: 28,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: "6px",
          textTransform: "uppercase",
          textShadow: `0 0 20px ${accentColor}`,
        }}
      >
        ⚡ {line.translation} ⚡
      </div>
    </div>
  );
};
