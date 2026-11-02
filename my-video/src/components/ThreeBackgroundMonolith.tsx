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

// Hermite smoothstep for cinematic in/out transitions
function getPresence(
  frame: number,
  start: number,
  fadeIn: number,
  fadeOut: number,
  end: number
): number {
  if (frame <= start || frame >= end) return 0;
  if (frame < fadeIn) {
    const t = (frame - start) / (fadeIn - start);
    return t * t * (3 - 2 * t);
  }
  if (frame > fadeOut) {
    const t = (end - frame) / (end - fadeOut);
    return t * t * (3 - 2 * t);
  }
  return 1;
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
    monolithLight: THREE.PointLight;
    yeroLight: THREE.PointLight;
    polaroidLight: THREE.PointLight;
    demolitionLight: THREE.PointLight;
    crystalLight: THREE.PointLight;
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

    // Atmospheric depth fog - seamlessly merges distant geometry with storm horizon
    scene.fog = new THREE.FogExp2(0x060c18, 0.0014);

    const threeCamera = new THREE.PerspectiveCamera(55, width / height, 10, 5000);
    threeCamera.rotation.order = "YXZ";
    threeCamera.position.set(0, 0, 500);

    // Global ambient & directional illumination rig (ensures zero black assets)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 3.5);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(400, 500, 400);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    rimLight.position.set(-500, -200, 200);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 2500);
    pointLight.position.set(0, 150, 0);
    scene.add(pointLight);

    // Dedicated local accent lights for each story group
    const monolithLight = new THREE.PointLight(0x00f0ff, 3.5, 900);
    monolithLight.position.set(480, 140, -120);
    scene.add(monolithLight);

    const yeroLight = new THREE.PointLight(0x38bdf8, 3.0, 900);
    yeroLight.position.set(0, -220, -80);
    scene.add(yeroLight);

    const polaroidLight = new THREE.PointLight(0x7dd3fc, 3.0, 800);
    polaroidLight.position.set(-460, 20, -80);
    scene.add(polaroidLight);

    const demolitionLight = new THREE.PointLight(0xf97316, 3.5, 800);
    demolitionLight.position.set(460, -140, -80);
    scene.add(demolitionLight);

    const crystalLight = new THREE.PointLight(0x00f0ff, 3.8, 900);
    crystalLight.position.set(-450, 150, -90);
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
                    color: new THREE.Color(0x384a66), // Luminous slate blue-grey
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
                    color: new THREE.Color(0xdce7f2), // Bright galvanized silver zinc
                    metalness: 0.35,
                    roughness: 0.25,
                    emissive: new THREE.Color(0x223a54),
                    emissiveIntensity: 0.25,
                    side: THREE.DoubleSide,
                  });
                } else if (childName.includes("polaroid")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xffffff), // Clean white polaroid border
                    metalness: 0.05,
                    roughness: 0.4,
                    emissive: new THREE.Color(0x38bdf8),
                    emissiveIntensity: 0.4,
                    side: THREE.DoubleSide,
                  });
                } else if (childName.includes("concrete")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xb2bfce), // Bright weathered light concrete
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

          // 1. Monolith: Upper-right celestial storm sky
          monolithGroup.scale.set(58, 58, 58);
          monolithGroup.position.set(480, 130, -200);
          scene.add(monolithGroup);

          // 2. Tumbling Yero: Lower horizon below text baseline
          yeroGroup.scale.set(115, 115, 115);
          yeroGroup.position.set(0, -250, -140);
          scene.add(yeroGroup);

          // 3. Memory Polaroid: Left atmospheric flank
          polaroidGroup.scale.set(155, 155, 155);
          polaroidGroup.position.set(-480, 20, -140);
          polaroidGroup.rotation.z = -0.22;
          scene.add(polaroidGroup);

          // 4. Demolition Concrete: Lower right flank
          demolitionGroup.scale.set(105, 105, 105);
          demolitionGroup.position.set(480, -160, -150);
          scene.add(demolitionGroup);

          // 5. Crystal Spike: Upper-left thunder flank
          crystalGroup.scale.set(85, 85, 85);
          crystalGroup.position.set(-470, 160, -160);
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
      monolithLight,
      yeroLight,
      polaroidLight,
      demolitionLight,
      crystalLight,
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

  // Per-frame immersive choreography & narrative staging
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
      monolithLight,
      yeroLight,
      polaroidLight,
      demolitionLight,
      crystalLight,
    } = ctx;

    // Follow camera orientation with smooth parallax scaling
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180 * 0.7;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180 * 0.7;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180 * 0.7;

    // =========================================================================
    // 1. SCENE-BASED NARRATIVE STAGING & PRESENCE FACTORS
    // =========================================================================
    // Yero Sheets: Chorus 1 ("Tatangayin ko bawat yero" ~ 58s - 90s, f1740-f2720)
    const yeroPresence = getPresence(frame, 1740, 1840, 2600, 2720);

    // Memory Polaroid: Verse 2 ("Itinago na litrato" ~ 90s - 118s, f2700-f3560)
    const polaroidPresence = getPresence(frame, 2700, 2790, 3450, 3560);

    // Concrete Demolition: Chorus 2 ("Gigibain ko mga pader n'yo" ~ 122s - 182s, f3680-f5480)
    const demolitionPresence = getPresence(frame, 3680, 3800, 5260, 5480);

    // Crystal Spikes: Bridge Climax ("Ako, ako ang bagyo" ~ 184s - 250s, f5520-f7500)
    const crystalPresence = getPresence(frame, 5520, 5700, 7200, 7500);

    // Monolith: Celestial anchor - dims subtly during intimate Verse 2 to spotlight Polaroid
    let monolithBasePresence = 0.85;
    if (frame >= 2700 && frame <= 3560) {
      monolithBasePresence = 0.35; // Dim to spotlight the Polaroid memory
    } else if (frame > 5500 && frame < 7200) {
      monolithBasePresence = 1.2; // Overdrive in Bridge climax
    }

    // =========================================================================
    // 2. DYNAMIC SIMULATION & IMMERSIVE LIVING MOTION
    // =========================================================================

    // 1. Monolith: Majestic gyroscopic rotation and hovering drift in upper-right sky
    if (monolithGroup.children.length > 0) {
      monolithGroup.visible = monolithBasePresence > 0.01;
      const s = 58 * monolithBasePresence;
      monolithGroup.scale.set(s, s, s);

      monolithGroup.rotation.y = frame * 0.012;
      monolithGroup.rotation.x = Math.sin(frame * 0.007) * 0.1;
      monolithGroup.position.x = 480 + Math.sin(frame * 0.005) * 25;
      monolithGroup.position.y = 130 + Math.cos(frame * 0.006) * 20;

      monolithGroup.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          const isCore =
            (child.name || "").toLowerCase().includes("core") ||
            (child.name || "").toLowerCase().includes("shard");
          child.material.emissiveIntensity = isLightningActive
            ? (isCore ? 6.5 : 1.6)
            : (isCore ? 3.2 : 0.5);
        }
      });
      monolithLight.intensity = 3.5 * monolithBasePresence;
    }

    // 2. Tumbling Yero: Violent hurricane vortex stream sweeping across lower horizon
    if (yeroGroup.children.length > 0) {
      if (yeroPresence > 0.001) {
        yeroGroup.visible = true;
        const s = 115 * yeroPresence;
        yeroGroup.scale.set(s, s, s);

        // Sweeping wind path across the lower horizon under lyrics
        const windCycle = ((frame * 5.2) % 2400) - 1200;
        yeroGroup.position.x = windCycle;
        yeroGroup.position.y = -250 + Math.sin(frame * 0.025) * 18;

        yeroGroup.children.forEach((sheet: any, idx) => {
          sheet.rotation.x = frame * (0.05 + idx * 0.014);
          sheet.rotation.y = frame * (0.04 + idx * 0.018);
          sheet.rotation.z = Math.sin(frame * 0.03 + idx) * 0.55;
        });
        yeroLight.intensity = 3.5 * yeroPresence;
      } else {
        yeroGroup.visible = false;
        yeroLight.intensity = 0;
      }
    }

    // 3. Memory Polaroid: Gentle atmospheric fluid drift on left flank in the rain
    if (polaroidGroup.children.length > 0) {
      if (polaroidPresence > 0.001) {
        polaroidGroup.visible = true;
        const s = 155 * polaroidPresence;
        polaroidGroup.scale.set(s, s, s);

        // Atmospheric updrafts & gentle fluid rocking
        polaroidGroup.position.x = -480 + Math.cos(frame * 0.012) * 20;
        polaroidGroup.position.y = 20 + Math.sin(frame * 0.016) * 25;
        polaroidGroup.rotation.z = -0.22 + Math.sin(frame * 0.01) * 0.08;
        polaroidGroup.rotation.y = Math.sin(frame * 0.014) * 0.18;
        polaroidLight.intensity = 3.2 * polaroidPresence;
      } else {
        polaroidGroup.visible = false;
        polaroidLight.intensity = 0;
      }
    }

    // 4. Demolition Concrete: Heavy structural rumble and shockwave vibration
    if (demolitionGroup.children.length > 0) {
      if (demolitionPresence > 0.001) {
        demolitionGroup.visible = true;
        const s = 105 * demolitionPresence;
        demolitionGroup.scale.set(s, s, s);

        // Bass drop structural rumble
        const bassTremor =
          (Math.sin(frame * 0.8) * 0.6 + Math.cos(frame * 1.3) * 0.4) *
          (isLightningActive ? 7 : 3);
        demolitionGroup.position.x = 480 + Math.sin(frame * 0.008) * 15;
        demolitionGroup.position.y = -160 + bassTremor + Math.cos(frame * 0.01) * 12;
        demolitionGroup.rotation.y = frame * 0.008;
        demolitionGroup.rotation.z = Math.sin(frame * 0.006) * 0.1;
        demolitionLight.intensity = 3.5 * demolitionPresence;
      } else {
        demolitionGroup.visible = false;
        demolitionLight.intensity = 0;
      }
    }

    // 5. Crystal Spike: High-altitude electric spire pulsing with apex lightning
    if (crystalGroup.children.length > 0) {
      if (crystalPresence > 0.001) {
        crystalGroup.visible = true;
        const s = 85 * crystalPresence;
        crystalGroup.scale.set(s, s, s);

        crystalGroup.position.x = -470 + Math.sin(frame * 0.009) * 18;
        crystalGroup.position.y = 160 + Math.cos(frame * 0.012) * 18;
        crystalGroup.rotation.y = -frame * 0.02;
        crystalGroup.rotation.z = Math.sin(frame * 0.015) * 0.18;

        crystalGroup.traverse((child: any) => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissiveIntensity = isLightningActive ? 6.8 : 3.0;
          }
        });
        crystalLight.intensity = 4.0 * crystalPresence;
      } else {
        crystalGroup.visible = false;
        crystalLight.intensity = 0;
      }
    }

    // =========================================================================
    // 3. DYNAMIC STORM LIGHTING RIG
    // =========================================================================
    if (isLightningActive) {
      hemiLight.intensity = 5.5;
      keyLight.intensity = 8.5;
      rimLight.intensity = 6.5;
      pointLight.intensity = 9.5;
      pointLight.color.set(accentColor);
    } else {
      hemiLight.intensity = 3.5;
      keyLight.intensity = 4.2;
      rimLight.intensity = 3.5;
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
