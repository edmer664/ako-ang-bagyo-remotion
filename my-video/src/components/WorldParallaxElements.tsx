import React from "react";

interface WorldParallaxProps {
  accentColor: string;
}

export const WorldParallaxElements: React.FC<WorldParallaxProps> = ({
  accentColor,
}) => {
  // 3D Depth coordinate layers for ambient atmospheric particles
  const particles = [
    { x: -500, y: -200, z: -1200, size: 8, opacity: 0.3 },
    { x: 450, y: 150, z: -2500, size: 12, opacity: 0.25 },
    { x: -350, y: 300, z: -4200, size: 10, opacity: 0.35 },
    { x: 600, y: -250, z: -6000, size: 14, opacity: 0.2 },
    { x: -400, y: -150, z: -8500, size: 9, opacity: 0.3 },
    { x: 300, y: 200, z: -11000, size: 12, opacity: 0.25 },
    { x: -550, y: 100, z: -14500, size: 11, opacity: 0.3 },
    { x: 400, y: -300, z: -18000, size: 15, opacity: 0.2 },
    { x: -300, y: 250, z: -22000, size: 10, opacity: 0.3 },
    { x: 500, y: -100, z: -26000, size: 13, opacity: 0.25 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Soft floating atmospheric storm embers / dust along the trajectory */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: accentColor,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${accentColor}`,
            transform: `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
          }}
        />
      ))}
    </div>
  );
};
