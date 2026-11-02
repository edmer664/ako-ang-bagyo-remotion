import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STORM_MONOLITH_BASE64 } from "../assets/stormMonolithBase64";
import { SpatialCoord } from "../lyricsData";

interface BackgroundMonolithProps {
  camera: SpatialCoord;
  accentColor: string;
  isLightningActive?: boolean;
}

export const ThreeBackgroundMonolith: React.FC<BackgroundMonolithProps> = ({
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
    monolithGroup: THREE.Group;
    yeroGroup: THREE.Group;
    polaroidGroup: THREE.Group;
    demolitionGroup: THREE.Group;
    crystalGroup: THREE.Group;
    pointLight: THREE.PointLight;
    ambientLight: THREE.AmbientLight;
  } | null>(null);

  // Initialize WebGL Scene
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const threeCamera = new THREE.PerspectiveCamera(55, width / height, 10, 5000);
    threeCamera.rotation.order = "YXZ";
    threeCamera.position.set(0, 0, 500);

    const ambientLight = new THREE.AmbientLight(0x2a3d54, 1.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 1.8, 3800);
    pointLight.position.set(300, 200, -400);
    scene.add(pointLight);

    // Dedicated clusters for each storyboard asset category
    const monolithGroup = new THREE.Group();
    const yeroGroup = new THREE.Group();
    const polaroidGroup = new THREE.Group();
    const demolitionGroup = new THREE.Group();
    const crystalGroup = new THREE.Group();

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
          const rawObjects = [...gltf.scene.children];

          rawObjects.forEach((obj) => {
            const name = obj.name;
            if (
              name.includes("StormMonolith") ||
              name.includes("InnerPlasmaCore") ||
              name.includes("OrbitalShard")
            ) {
              monolithGroup.add(obj);
            } else if (name.includes("TumblingYero")) {
              yeroGroup.add(obj);
            } else if (name.includes("MemoryPolaroid")) {
              polaroidGroup.add(obj);
            } else if (name.includes("ConcreteBlock") || name.includes("RebarRod")) {
              demolitionGroup.add(obj);
            } else if (name.includes("CrystalSpike")) {
              crystalGroup.add(obj);
            } else {
              monolithGroup.add(obj);
            }
          });

          // 1. Monolith Cluster: Upper-right celestial storm sky
          monolithGroup.scale.set(22, 22, 22);
          monolithGroup.position.set(480, 140, -960);
          scene.add(monolithGroup);

          // 2. Tumbling Yero: Lower horizon below text baseline
          yeroGroup.scale.set(20, 20, 20);
          yeroGroup.position.set(0, -340, -850);
          scene.add(yeroGroup);

          // 3. Memory Polaroid: Left atmospheric flank
          polaroidGroup.scale.set(40, 40, 40);
          polaroidGroup.position.set(-520, 80, -880);
          polaroidGroup.rotation.z = -0.22;
          scene.add(polaroidGroup);

          // 4. Demolition Concrete: Far right lower flank
          demolitionGroup.scale.set(28, 28, 28);
          demolitionGroup.position.set(580, -180, -900);
          scene.add(demolitionGroup);

          // 5. Crystal Spike: Far upper-left thunder core
          crystalGroup.scale.set(28, 28, 28);
          crystalGroup.position.set(-480, 180, -920);
          scene.add(crystalGroup);
        },
        (error) => {
          console.warn("Failed to parse storyboard GLB:", error);
        }
      );
    } catch (err) {
      console.warn("Error loading storyboard assets:", err);
    }

    contextRef.current = {
      renderer,
      scene,
      threeCamera,
      monolithGroup,
      yeroGroup,
      polaroidGroup,
      demolitionGroup,
      crystalGroup,
      pointLight,
      ambientLight,
    };

    return () => {
      [monolithGroup, yeroGroup, polaroidGroup, demolitionGroup, crystalGroup].forEach((grp) => {
        grp.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
        scene.remove(grp);
      });
      renderer.dispose();
      contextRef.current = null;
    };
  }, [width, height]);

  // Per-frame animation
  useLayoutEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const {
      renderer,
      scene,
      threeCamera,
      monolithGroup,
      yeroGroup,
      polaroidGroup,
      demolitionGroup,
      crystalGroup,
      pointLight,
      ambientLight,
    } = ctx;

    // Follow camera orientation with smooth parallax scaling
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180 * 0.7;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180 * 0.7;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180 * 0.7;

    // 1. Monolith: Gyroscopic rotation and floating drift
    if (monolithGroup.children.length > 0) {
      monolithGroup.rotation.y = frame * 0.01;
      monolithGroup.rotation.x = Math.sin(frame * 0.007) * 0.12;
      monolithGroup.position.x = 480 + Math.sin(frame * 0.005) * 40;
      monolithGroup.position.y = 140 + Math.cos(frame * 0.006) * 30;

      // Pulse emissive core when lightning strikes
      monolithGroup.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissiveIntensity = isLightningActive ? 3.8 : 1.2;
        }
      });
    }

    // 2. Tumbling Yero: Horizontal wind drift across lower horizon
    if (yeroGroup.children.length > 0) {
      const windOffset = ((frame * 3.5) % 1800) - 900;
      yeroGroup.position.x = windOffset;
      yeroGroup.rotation.z = Math.sin(frame * 0.03) * 0.25;
      yeroGroup.rotation.x = frame * 0.02;
    }

    // 3. Memory Polaroid: Gentle breathing drift on left flank
    if (polaroidGroup.children.length > 0) {
      polaroidGroup.position.y = 80 + Math.sin(frame * 0.012) * 15;
      polaroidGroup.rotation.z = -0.22 + Math.sin(frame * 0.008) * 0.06;
    }

    // 4. Demolition Concrete: Heavy rumble vibration on shockwaves
    if (demolitionGroup.children.length > 0) {
      const rumble = isLightningActive ? (Math.random() - 0.5) * 6 : 0;
      demolitionGroup.position.y = -180 + rumble;
      demolitionGroup.rotation.y = frame * 0.004;
    }

    // 5. Crystal Spike: Slow celestial spin with lightning reaction
    if (crystalGroup.children.length > 0) {
      crystalGroup.rotation.y = -frame * 0.015;
      crystalGroup.rotation.z = Math.sin(frame * 0.01) * 0.15;
      crystalGroup.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissiveIntensity = isLightningActive ? 5.0 : 1.5;
        }
      });
    }

    if (isLightningActive) {
      pointLight.intensity = 6.0;
      pointLight.color.set(accentColor);
      ambientLight.intensity = 2.8;
    } else {
      pointLight.intensity = 1.4;
      pointLight.color.setHex(0x00f0ff);
      ambientLight.intensity = 1.2;
    }

    renderer.render(scene, threeCamera);
  }, [frame, camera, isLightningActive, accentColor]);

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
