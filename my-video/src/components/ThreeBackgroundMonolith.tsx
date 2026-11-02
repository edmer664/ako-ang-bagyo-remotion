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
    hemiLight: THREE.HemisphereLight;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
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

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 3.5);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(400, 500, 400);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 3.5);
    rimLight.position.set(-500, -200, 200);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 2500);
    pointLight.position.set(200, 100, -100);
    scene.add(pointLight);

    // Dedicated local accent point lights to sculpt each asset group with dramatic illumination
    const monolithLight = new THREE.PointLight(0x00f0ff, 3.5, 800);
    monolithLight.position.set(500, 120, -100);
    scene.add(monolithLight);

    const polaroidLight = new THREE.PointLight(0x7dd3fc, 2.8, 700);
    polaroidLight.position.set(-490, 30, -80);
    scene.add(polaroidLight);

    const rebarLight = new THREE.PointLight(0xf97316, 3.0, 700);
    rebarLight.position.set(490, -150, -80);
    scene.add(rebarLight);

    const crystalLight = new THREE.PointLight(0x38bdf8, 3.5, 800);
    crystalLight.position.set(-470, 160, -90);
    scene.add(crystalLight);

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

          rawObjects.forEach((obj: any) => {
            const name = obj.name || "";

            // Override and enhance materials: bright, colorful, vibrant specular highlights (NEVER dark/black)
            obj.traverse((child: any) => {
              if (child.isMesh) {
                const childName = (child.name || name || "").toLowerCase();

                if (childName.includes("monolith")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x384860), // Luminous slate blue-grey
                    metalness: 0.2,
                    roughness: 0.28,
                    emissive: new THREE.Color(0x00f0ff),
                    emissiveIntensity: 0.5,
                  });
                } else if (childName.includes("plasmacore") || childName.includes("shard")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x00ffff),
                    metalness: 0.05,
                    roughness: 0.1,
                    emissive: new THREE.Color(0x00f5ff),
                    emissiveIntensity: 3.2,
                  });
                } else if (childName.includes("yero")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xdce6f2), // Bright galvanized silver zinc
                    metalness: 0.35,
                    roughness: 0.25,
                    emissive: new THREE.Color(0x223a54),
                    emissiveIntensity: 0.25,
                    side: THREE.DoubleSide,
                  });
                } else if (childName.includes("polaroid")) {
                  // Clean polaroid photo with glowing inner storm gradient
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xffffff), // Bright polaroid white border
                    metalness: 0.05,
                    roughness: 0.4,
                    emissive: new THREE.Color(0x38bdf8),
                    emissiveIntensity: 0.4,
                    side: THREE.DoubleSide,
                  });
                } else if (childName.includes("concrete")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xb0bccb), // Bright weathered light concrete
                    metalness: 0.05,
                    roughness: 0.7,
                    emissive: new THREE.Color(0x222d3d),
                    emissiveIntensity: 0.2,
                  });
                } else if (childName.includes("rebar")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xf97316), // Vivid industrial rust orange-red that pops!
                    metalness: 0.3,
                    roughness: 0.4,
                    emissive: new THREE.Color(0xc2410c),
                    emissiveIntensity: 0.6,
                  });
                } else if (childName.includes("crystal")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x38bdf8),
                    metalness: 0.1,
                    roughness: 0.1,
                    emissive: new THREE.Color(0x00f5ff),
                    emissiveIntensity: 2.8,
                    transparent: true,
                    opacity: 0.95,
                  });
                }
              }
            });

            if (
              name.includes("StormMonolith") ||
              name.includes("InnerPlasmaCore") ||
              name.includes("OrbitalShard")
            ) {
              monolithGroup.add(obj);
            } else if (name.includes("TumblingYero")) {
              yeroGroup.add(obj);
            } else if (name.includes("MemoryPolaroid")) {
              // Orient the flat frame so its broad front face looks toward camera (not edge-on)
              obj.rotation.x = Math.PI / 2;
              polaroidGroup.add(obj);

              // Vivid photo insert mesh on the front face of the polaroid
              const photoGeom = new THREE.PlaneGeometry(0.96, 1.18);
              const photoMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0x38bdf8),
                side: THREE.DoubleSide,
              });
              const photoMesh = new THREE.Mesh(photoGeom, photoMat);
              photoMesh.position.set(0, 0.08, 0.025);
              polaroidGroup.add(photoMesh);
            } else if (name.includes("ConcreteBlock") || name.includes("RebarRod")) {
              demolitionGroup.add(obj);
            } else if (name.includes("CrystalSpike")) {
              crystalGroup.add(obj);
            } else {
              monolithGroup.add(obj);
            }
          });

          // 1. Monolith Cluster: Upper-right celestial storm sky - imposing, prominent, close
          monolithGroup.scale.set(65, 65, 65);
          monolithGroup.position.set(510, 120, -180);
          scene.add(monolithGroup);

          // 2. Tumbling Yero: Lower horizon below text baseline - large, spinning corrugated galvanized sheets
          yeroGroup.scale.set(120, 120, 120);
          yeroGroup.position.set(0, -250, -140);
          scene.add(yeroGroup);

          // 3. Memory Polaroid: Left atmospheric flank - large, crisp white frame with cyan photo
          polaroidGroup.scale.set(160, 160, 160);
          polaroidGroup.position.set(-510, 30, -160);
          polaroidGroup.rotation.z = -0.22;
          scene.add(polaroidGroup);

          // 4. Demolition Concrete: Lower right flank - bold cracked concrete with bright orange rebar
          demolitionGroup.scale.set(110, 110, 110);
          demolitionGroup.position.set(510, -170, -150);
          scene.add(demolitionGroup);

          // 5. Crystal Spike: Upper-left thunder flank - towering electric crystalline spike
          crystalGroup.scale.set(90, 90, 90);
          crystalGroup.position.set(-490, 170, -160);
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
      hemiLight,
      keyLight,
      rimLight,
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
      hemiLight,
      keyLight,
      rimLight,
    } = ctx;

    // Follow camera orientation with smooth parallax scaling
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180 * 0.7;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180 * 0.7;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180 * 0.7;

    // 1. Monolith: Majestic gyroscopic rotation and hovering drift in upper-right sky
    if (monolithGroup.children.length > 0) {
      monolithGroup.rotation.y = frame * 0.012;
      monolithGroup.rotation.x = Math.sin(frame * 0.007) * 0.1;
      monolithGroup.position.x = 510 + Math.sin(frame * 0.005) * 25;
      monolithGroup.position.y = 120 + Math.cos(frame * 0.006) * 20;

      monolithGroup.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          const isCore = (child.name || "").toLowerCase().includes("core") || (child.name || "").toLowerCase().includes("shard");
          child.material.emissiveIntensity = isLightningActive
            ? (isCore ? 6.5 : 1.6)
            : (isCore ? 3.2 : 0.5);
        }
      });
    }

    // 2. Tumbling Yero: Horizontal wind drift across lower horizon under lyrics
    if (yeroGroup.children.length > 0) {
      const windOffset = ((frame * 4.2) % 2400) - 1200;
      yeroGroup.position.x = windOffset;
      yeroGroup.position.y = -250 + Math.sin(frame * 0.02) * 15;

      yeroGroup.children.forEach((sheet: any, idx) => {
        sheet.rotation.x = frame * (0.04 + idx * 0.012);
        sheet.rotation.y = frame * (0.035 + idx * 0.015);
        sheet.rotation.z = Math.sin(frame * 0.02 + idx) * 0.45;
      });
    }

    // 3. Memory Polaroid: Gentle breathing drift on left flank
    if (polaroidGroup.children.length > 0) {
      polaroidGroup.position.y = 30 + Math.sin(frame * 0.014) * 18;
      polaroidGroup.position.x = -510 + Math.cos(frame * 0.009) * 15;
      polaroidGroup.rotation.z = -0.22 + Math.sin(frame * 0.008) * 0.06;
      polaroidGroup.rotation.y = Math.sin(frame * 0.011) * 0.14;
    }

    // 4. Demolition Concrete: Heavy rumble vibration on shockwaves, floating lower right
    if (demolitionGroup.children.length > 0) {
      const rumble = isLightningActive ? (Math.random() - 0.5) * 8 : 0;
      demolitionGroup.position.x = 510 + Math.sin(frame * 0.006) * 15;
      demolitionGroup.position.y = -170 + rumble + Math.cos(frame * 0.008) * 10;
      demolitionGroup.rotation.y = frame * 0.006;
    }

    // 5. Crystal Spike: Slow celestial spin with lightning reaction in upper left
    if (crystalGroup.children.length > 0) {
      crystalGroup.position.x = -490 + Math.sin(frame * 0.007) * 15;
      crystalGroup.position.y = 170 + Math.cos(frame * 0.01) * 15;
      crystalGroup.rotation.y = -frame * 0.018;
      crystalGroup.rotation.z = Math.sin(frame * 0.012) * 0.2;

      crystalGroup.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissiveIntensity = isLightningActive ? 6.5 : 2.8;
        }
      });
    }

    // Dynamic storm lighting reacting to lightning flashes
    if (isLightningActive) {
      hemiLight.intensity = 5.5;
      keyLight.intensity = 8.0;
      rimLight.intensity = 6.0;
      pointLight.intensity = 9.0;
      pointLight.color.set(accentColor);
    } else {
      hemiLight.intensity = 3.2;
      keyLight.intensity = 4.0;
      rimLight.intensity = 3.2;
      pointLight.intensity = 2.5;
      pointLight.color.setHex(0x00f0ff);
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
