import React from "react";

interface WorldParallaxProps {
  accentColor: string;
  cameraZ: number;
  frame: number;
  activeSection?: string;
}

export const WorldParallaxElements: React.FC<WorldParallaxProps> = ({
  accentColor,
  cameraZ,
  frame,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* ============================================================== */}
      {/* SCENE 1: EYE OF THE STORM (Intro, Z: 500 to -800)               */}
      {/* ============================================================== */}
      {cameraZ > -1500 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Concentric Cyclone Gyre Rings placed in deep background */}
          {[-400, -800, -1200].map((z, idx) => {
            const rot = frame * (0.4 + idx * 0.2) * (idx % 2 === 0 ? 1 : -1);
            const size = 1800 + idx * 400;
            return (
              <div
                key={`cyclone-${idx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  transform: `translate3d(0, 0, ${z}px) rotateZ(${rot}deg)`,
                  borderRadius: "50%",
                  border: `2px dashed ${accentColor}30`,
                  boxShadow: `0 0 60px ${accentColor}15, inset 0 0 60px ${accentColor}15`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 2: THE DIZZY ORBIT (Verse 1, Z: -400 to -2400)           */}
      {/* ============================================================== */}
      {cameraZ <= 0 && cameraZ > -3000 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Orbital Elliptical Rings rotating along the Y/Z plane */}
          {[-800, -1400, -2000].map((z, idx) => {
            const spin = frame * 0.5 + idx * 45;
            return (
              <div
                key={`orbit-ring-${idx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 2000,
                  height: 900,
                  marginLeft: -1000,
                  marginTop: -450,
                  transform: `translate3d(${(idx % 2 === 0 ? -1 : 1) * 350}px, ${(idx % 2 === 0 ? 180 : -180)}px, ${z}px) rotateY(${spin}deg) rotateX(60deg)`,
                  borderRadius: "50%",
                  border: `2px solid ${accentColor}25`,
                  boxShadow: `0 0 40px ${accentColor}20`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 3: HAZARD ZONE (Pre-Chorus 1 & 2, Z: -2500 to -3500 & -10000 to -11500) */}
      {/* ============================================================== */}
      {((cameraZ <= -2200 && cameraZ > -3700) ||
        (cameraZ <= -9800 && cameraZ > -11600)) && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Flanking Angled Hazard Monolith Barriers (Positioned strictly BEHIND text and wide on lateral borders) */}
          {[-1, 1].map((side, sideIdx) => {
            const xOffset = side * 880;
            const targetZ = cameraZ <= -9000 ? -11200 : -3500;
            return (
              <div
                key={`hazard-wall-${sideIdx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 140,
                  height: 1800,
                  marginLeft: xOffset - 70,
                  marginTop: -900,
                  transform: `translate3d(0, 0, ${targetZ}px) rotateY(${side * -25}deg) rotateZ(${side * 18}deg)`,
                  backgroundImage: `repeating-linear-gradient(45deg, #ff3b30 0px, #ff3b30 30px, #1a0206 30px, #1a0206 60px)`,
                  opacity: 0.75,
                  boxShadow: `0 0 60px #ff3b3070`,
                  borderRadius: 6,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 4: TEMPEST ROOFTOPS (Chorus 1, Z: -3600 to -6800)        */}
      {/* ============================================================== */}
      {cameraZ <= -3200 && cameraZ > -7200 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Silhouetted Rooftop Pitches and Tearing Wind Beams strictly in Lower Third & Deep Background */}
          {[-3800, -4600, -5400, -7200].map((z, idx) => {
            const x = (idx % 2 === 0 ? -1 : 1) * 750;
            const y = 520;
            const windSpeed = ((frame * 24 + idx * 200) % 2000) - 1000;
            return (
              <React.Fragment key={`roof-${idx}`}>
                {/* 3D Angled Corrugated Rooftop Silhouette */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 750,
                    height: 280,
                    marginLeft: x - 375,
                    marginTop: y - 140,
                    transform: `translate3d(0, 0, ${z}px) rotateX(40deg) rotateZ(${idx % 2 === 0 ? -12 : 12}deg)`,
                    backgroundColor: "rgba(10, 20, 35, 0.75)",
                    borderTop: `3px solid ${accentColor}60`,
                    backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 15px, transparent 15px, transparent 30px)`,
                    boxShadow: `0 -10px 40px ${accentColor}20`,
                    borderRadius: 4,
                  }}
                />
                {/* High-speed Horizontal Wind Streaks in lower horizon */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 600,
                    height: 2,
                    marginLeft: windSpeed - 300,
                    marginTop: y - 100,
                    transform: `translate3d(0, 0, ${z}px) rotateZ(-4deg)`,
                    backgroundColor: accentColor,
                    opacity: 0.5,
                    boxShadow: `0 0 15px ${accentColor}`,
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 5: MEMORY CHAMBER & TENSION CORDS (Verse 2, Z: -6900 to -10000) */}
      {/* ============================================================== */}
      {cameraZ <= -6600 && cameraZ > -10300 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Suspended Red Tension Strings on outer borders */}
          {[-7200, -8000, -8800, -9600].map((z, idx) => {
            const sway = Math.sin(frame * 0.1 + idx) * 15;
            return (
              <React.Fragment key={`cord-${idx}`}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 1800,
                    height: 2,
                    marginLeft: -900,
                    marginTop: sway,
                    transform: `translate3d(0, ${(idx % 2 === 0 ? -1 : 1) * 440}px, ${z}px) rotateZ(${(idx % 2 === 0 ? 1 : -1) * 6}deg)`,
                    backgroundColor: "#ef4444",
                    opacity: 0.55,
                    boxShadow: "0 0 20px #ef444480",
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 6: WALL DEMOLITION (Chorus 2, Z: -11200 to -16500)       */}
      {/* ============================================================== */}
      {cameraZ <= -11000 && cameraZ > -16800 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Massive Architectural Concrete Pillars Flanking Flight Path */}
          {[-11600, -12400, -13200, -14000, -14800, -16800].map((z, idx) => {
            const side = idx % 2 === 0 ? -1 : 1;
            return (
              <div
                key={`pillar-${idx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 320,
                  height: 1400,
                  marginLeft: side * 920 - 160,
                  marginTop: -700,
                  transform: `translate3d(0, 0, ${z}px) rotateY(${side * -25}deg)`,
                  backgroundColor: "rgba(12, 16, 26, 0.85)",
                  border: `2px solid rgba(255, 59, 48, 0.35)`,
                  boxShadow: `0 0 50px rgba(255, 59, 48, 0.25)`,
                  borderRadius: 6,
                }}
              >
                {/* Structural rebar accent strip */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 40px, transparent 40px, transparent 80px)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 7: RAIN VOID & THUNDER CORE (Bridge, Z: -16600 to -24800) */}
      {/* ============================================================== */}
      {cameraZ <= -16400 && cameraZ > -25000 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Dense Atmospheric Rain Curtains and Glowing Orbs on Lateral Margins */}
          {[-17200, -18800, -20400, -22000, -23600].map((z, idx) => {
            const orbX = (idx % 2 === 0 ? -1 : 1) * (680 + (idx % 3) * 60);
            const orbY = Math.cos(frame * 0.04 + idx) * 260;
            return (
              <React.Fragment key={`void-plane-${idx}`}>
                {/* Floating Luminous Storm Energy Spheres */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 30 + idx * 8,
                    height: 30 + idx * 8,
                    marginLeft: orbX - 20,
                    marginTop: orbY - 20,
                    transform: `translate3d(0, 0, ${z}px)`,
                    borderRadius: "50%",
                    backgroundColor: "#c084fc",
                    boxShadow: "0 0 60px #c084fc, 0 0 120px #c084fc60",
                    opacity: 0.6,
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENE 8: STRATOSPHERIC CLIMAX (Outro, Z: -24800 to -28500)      */}
      {/* ============================================================== */}
      {cameraZ <= -24600 && (
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Vertical Stratospheric Clouds Rushing Downward Flanking Lateral Edges */}
          {[-25200, -26000, -26800, -27600].map((z, idx) => {
            const cloudY = ((frame * 20 + idx * 300) % 2400) - 1200;
            return (
              <div
                key={`cloud-shard-${idx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 900,
                  height: 350,
                  marginLeft: (idx % 2 === 0 ? -850 : 350),
                  marginTop: cloudY,
                  transform: `translate3d(0, 0, ${z}px) rotateZ(${idx % 2 === 0 ? -15 : 15}deg)`,
                  background: `radial-gradient(ellipse at 50% 50%, ${accentColor}25 0%, transparent 75%)`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
