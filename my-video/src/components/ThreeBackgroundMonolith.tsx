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
    monolithGroup: THREE.Group | null;
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

    const ambientLight = new THREE.AmbientLight(0x2a3d54, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 1.5, 3500);
    pointLight.position.set(300, 200, -400);
    scene.add(pointLight);

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
          // Scaled to a balanced monumental size (22x)
          monolithGroup.scale.set(22, 22, 22);
          // Positioned off-center in the upper-right background sky
          monolithGroup.position.set(460, 120, -950);
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
      monolithGroup,
      pointLight,
      ambientLight,
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
      renderer.dispose();
      contextRef.current = null;
    };
  }, [width, height]);

  // Per-frame animation
  useLayoutEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const { renderer, scene, threeCamera, monolithGroup, pointLight, ambientLight } = ctx;

    // Follow camera orientation with smooth parallax scaling
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180 * 0.7;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180 * 0.7;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180 * 0.7;

    if (monolithGroup) {
      // Gentle majestic gyroscopic rotation
      monolithGroup.rotation.y = frame * 0.01;
      monolithGroup.rotation.x = Math.sin(frame * 0.007) * 0.12;
      monolithGroup.rotation.z = Math.cos(frame * 0.008) * 0.08;

      // Parallax floating drift in the right atmospheric quadrant
      monolithGroup.position.x = 460 + Math.sin(frame * 0.005) * 40;
      monolithGroup.position.y = 120 + Math.cos(frame * 0.006) * 30;
      monolithGroup.position.z = -950 + Math.sin(frame * 0.01) * 30;

      // Pulse emissive core when lightning strikes
      monolithGroup.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (child.material.emissive) {
            child.material.emissiveIntensity = isLightningActive ? 3.8 : 1.2;
          }
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
