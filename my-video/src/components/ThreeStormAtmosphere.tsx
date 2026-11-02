import React, { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STORM_MONOLITH_BASE64 } from "../assets/stormMonolithBase64";
import { SpatialCoord } from "../lyricsData";

interface ThreeAtmosphereProps {
  section: string;
  camera: SpatialCoord;
  accentColor: string;
  isLightningActive?: boolean;
}

const RAIN_COUNT = 3200;
const DUST_COUNT = 1200;

export const ThreeStormAtmosphere: React.FC<ThreeAtmosphereProps> = ({
  section,
  camera,
  accentColor,
  isLightningActive = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const contextRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    threeCamera: THREE.PerspectiveCamera;
    rainLines: THREE.LineSegments;
    rainPositions: Float32Array;
    rainBase: Float32Array;
    dustPoints: THREE.Points;
    dustPositions: Float32Array;
    dustBase: Float32Array;
    dustMaterial: THREE.PointsMaterial;
    pointLight: THREE.PointLight;
    ambientLight: THREE.AmbientLight;
    monolithGroup: THREE.Group | null;
  } | null>(null);

  // Section-specific wind, rain, and particle dynamics
  const sectionDynamics = useMemo(() => {
    switch (section) {
      case "chorus":
      case "chorus2":
        return {
          windX: -26,
          windY: -54,
          windZ: -12,
          rainLength: 85,
          rainOpacity: 0.85,
          dustColor: 0x00f0ff,
          dustSpeedY: -15,
          dustSpeedX: -20,
          skyColor: 0x041426,
        };
      case "prechorus":
        return {
          windX: -14,
          windY: -44,
          windZ: -6,
          rainLength: 65,
          rainOpacity: 0.75,
          dustColor: 0xff3b30,
          dustSpeedY: 10, // rising embers
          dustSpeedX: -6,
          skyColor: 0x22050b,
        };
      case "bridge":
        return {
          windX: -3,
          windY: -30,
          windZ: -2,
          rainLength: 48,
          rainOpacity: 0.6,
          dustColor: 0xc084fc,
          dustSpeedY: -4,
          dustSpeedX: 2,
          skyColor: 0x120420,
        };
      case "outro":
        return {
          windX: 18,
          windY: -62,
          windZ: 14,
          rainLength: 95,
          rainOpacity: 0.9,
          dustColor: 0x38bdf8,
          dustSpeedY: -35,
          dustSpeedX: 12,
          skyColor: 0x082240,
        };
      case "verse1":
      case "verse2":
      default:
        return {
          windX: -8,
          windY: -36,
          windZ: -4,
          rainLength: 55,
          rainOpacity: 0.65,
          dustColor: 0x38bdf8,
          dustSpeedY: -8,
          dustSpeedX: -4,
          skyColor: 0x060f1c,
        };
    }
  }, [section]);

  // Initial pseudo-random distribution of particles in 3D space
  const initialData = useMemo(() => {
    const rain = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      rain[i * 3 + 0] = (random(`rain-x-${i}`) - 0.5) * 2800; // X
      rain[i * 3 + 1] = (random(`rain-y-${i}`) - 0.5) * 2000; // Y
      rain[i * 3 + 2] = -random(`rain-z-${i}`) * 2400 + 400; // Z
    }

    const dust = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dust[i * 3 + 0] = (random(`dust-x-${i}`) - 0.5) * 2400;
      dust[i * 3 + 1] = (random(`dust-y-${i}`) - 0.5) * 1600;
      dust[i * 3 + 2] = -random(`dust-z-${i}`) * 2000 + 300;
    }

    return { rain, dust };
  }, []);

  // Initialize Three.js scene
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050b, 0.0005);

    const threeCamera = new THREE.PerspectiveCamera(
      55,
      width / height,
      10,
      5000
    );
    threeCamera.rotation.order = "YXZ";
    threeCamera.position.set(0, 0, 500);

    // Lights for lightning strikes and atmospheric glow
    const ambientLight = new THREE.AmbientLight(0x2a3d54, 1.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 1.2, 4000);
    pointLight.position.set(0, 300, 200);
    scene.add(pointLight);

    // 2. Realistic 3D Rain Line Segments (Head & Tail)
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(RAIN_COUNT * 6);
    rainGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(rainPositions, 3)
    );

    const rainMat = new THREE.LineBasicMaterial({
      color: 0xa8e6ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const rainLines = new THREE.LineSegments(rainGeo, rainMat);
    scene.add(rainLines);

    // 3. Volumetric Atmospheric Storm Dust / Embers
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );

    // Procedural circle texture for particles
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.7)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 14,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMaterial);
    scene.add(dustPoints);

    // 4. Load & Instantiate the 3D Blender Storm Monolith & Shards
    let monolithGroup: THREE.Group | null = null;
    try {
      const binaryString = atob(STORM_MONOLITH_BASE64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const loader = new GLTFLoader();
      loader.parse(
        bytes.buffer,
        "",
        (gltf) => {
          monolithGroup = gltf.scene;
          monolithGroup.scale.set(45, 45, 45);
          monolithGroup.position.set(0, 0, -850);
          scene.add(monolithGroup);
        },
        (error) => {
          console.warn("Failed to parse StormMonolith GLB:", error);
        }
      );
    } catch (err) {
      console.warn("Error loading StormMonolith:", err);
    }

    contextRef.current = {
      renderer,
      scene,
      threeCamera,
      rainLines,
      rainPositions,
      rainBase: initialData.rain,
      dustPoints,
      dustPositions,
      dustBase: initialData.dust,
      dustMaterial,
      pointLight,
      ambientLight,
      monolithGroup,
    };

    return () => {
      if (monolithGroup) {
        (monolithGroup as THREE.Group).traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
        scene.remove(monolithGroup);
      }
      rainGeo.dispose();
      rainMat.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
      contextRef.current = null;
    };
  }, [width, height, initialData]);

  // Synchronous per-frame update and render
  useLayoutEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const {
      renderer,
      scene,
      threeCamera,
      rainLines,
      rainPositions,
      rainBase,
      dustPoints,
      dustPositions,
      dustBase,
      dustMaterial,
      pointLight,
      ambientLight,
      monolithGroup,
    } = ctx;

    // Animate the 3D Blender Storm Monolith in deep atmospheric space
    if (monolithGroup) {
      monolithGroup.rotation.y = frame * 0.012;
      monolithGroup.rotation.x = Math.sin(frame * 0.009) * 0.14;
      monolithGroup.rotation.z = Math.cos(frame * 0.011) * 0.08;
      monolithGroup.position.x = Math.sin(frame * 0.006) * 110;
      monolithGroup.position.y = Math.cos(frame * 0.008) * 60 - 20;
      monolithGroup.position.z = -920 + Math.sin(frame * 0.014) * 50;

      // Pulse emissive core when lightning strikes
      monolithGroup.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (child.material.emissive) {
            child.material.emissiveIntensity = isLightningActive ? 3.5 : 1.2;
          }
        }
      });
    }

    // Couple Three.js Camera directly to Remotion's 3D coordinates
    // Scaling matches CSS 3D perspective
    threeCamera.position.x = camera.x * 0.2;
    threeCamera.position.y = -camera.y * 0.2;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180;

    // Lightning flash illumination
    if (isLightningActive) {
      pointLight.intensity = 7.5;
      pointLight.color.set(accentColor);
      ambientLight.intensity = 3.5;
    } else {
      pointLight.intensity = 1.0;
      pointLight.color.setHex(sectionDynamics.dustColor);
      ambientLight.intensity = 1.2;
    }

    const {
      windX,
      windY,
      windZ,
      rainLength,
      rainOpacity,
      dustColor,
      dustSpeedX,
      dustSpeedY,
    } = sectionDynamics;

    // --- 1. SIMULATE 3D RAINDROPS ---
    const boxW = 2800;
    const boxH = 2000;
    const boxD = 2400;

    for (let i = 0; i < RAIN_COUNT; i++) {
      const bx = rainBase[i * 3 + 0];
      const by = rainBase[i * 3 + 1];
      const bz = rainBase[i * 3 + 2];

      const curX =
        ((bx + frame * windX) % boxW + boxW) % boxW - boxW / 2;
      const curY =
        ((by + frame * windY) % boxH + boxH) % boxH - boxH / 2;
      const curZ =
        ((bz + frame * windZ) % boxD + boxD) % boxD - boxD + 400;

      // Drop Head
      rainPositions[i * 6 + 0] = curX;
      rainPositions[i * 6 + 1] = curY;
      rainPositions[i * 6 + 2] = curZ;

      // Drop Tail (physically aligned with wind velocity vector)
      rainPositions[i * 6 + 3] =
        curX - (windX / Math.abs(windY)) * rainLength;
      rainPositions[i * 6 + 4] = curY + rainLength;
      rainPositions[i * 6 + 5] =
        curZ - (windZ / Math.abs(windY)) * rainLength;
    }
    rainLines.geometry.attributes.position.needsUpdate = true;
    (rainLines.material as THREE.LineBasicMaterial).opacity = rainOpacity;

    // --- 2. SIMULATE 3D STORM PARTICLES / DUST / EMBERS ---
    const dustBoxW = 2400;
    const dustBoxH = 1600;
    const dustBoxD = 2000;

    for (let i = 0; i < DUST_COUNT; i++) {
      const bx = dustBase[i * 3 + 0];
      const by = dustBase[i * 3 + 1];
      const bz = dustBase[i * 3 + 2];

      const curX =
        ((bx + frame * dustSpeedX) % dustBoxW + dustBoxW) % dustBoxW -
        dustBoxW / 2;
      const curY =
        ((by + frame * dustSpeedY) % dustBoxH + dustBoxH) % dustBoxH -
        dustBoxH / 2;
      const curZ =
        ((bz + frame * -3) % dustBoxD + dustBoxD) % dustBoxD -
        dustBoxD +
        300;

      dustPositions[i * 3 + 0] = curX;
      dustPositions[i * 3 + 1] = curY;
      dustPositions[i * 3 + 2] = curZ;
    }
    dustPoints.geometry.attributes.position.needsUpdate = true;
    dustMaterial.color.setHex(dustColor);

    renderer.render(scene, threeCamera);
  }, [
    frame,
    camera,
    sectionDynamics,
    isLightningActive,
    accentColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};
