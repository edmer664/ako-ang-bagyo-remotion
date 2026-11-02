import React, { useLayoutEffect, useRef } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
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
    artifactCitadel: THREE.Group;
    coreAssembly: THREE.Group;
    shardsGimbal: THREE.Group;
    yeroWingsLeft: THREE.Group;
    yeroWingsRight: THREE.Group;
    polaroidAperture: THREE.Group;
    demolitionFoundation: THREE.Group;
    thunderSpireCrown: THREE.Group;
    pointLight: THREE.PointLight;
    hemiLight: THREE.HemisphereLight;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    coreAccentLight: THREE.PointLight;
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
    scene.fog = new THREE.FogExp2(0x060c18, 0.0012);

    const threeCamera = new THREE.PerspectiveCamera(55, width / height, 10, 5000);
    threeCamera.rotation.order = "YXZ";
    threeCamera.position.set(0, 0, 500);

    // Global ambient & directional illumination rig (ensures zero black assets)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 3.6);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(400, 500, 400);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 3.6);
    rimLight.position.set(-500, -200, 200);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 2500);
    pointLight.position.set(0, 150, 0);
    scene.add(pointLight);

    // Dedicated local accent point light attached right in front of the unfolding citadel
    const coreAccentLight = new THREE.PointLight(0x00f0ff, 4.2, 1200);
    coreAccentLight.position.set(460, 120, -100);
    scene.add(coreAccentLight);

    // =========================================================================
    // UNIFIED UNFOLDING ARTIFACT CITADEL HIERARCHY
    // =========================================================================
    const artifactCitadel = new THREE.Group();
    artifactCitadel.position.set(460, 110, -200);
    artifactCitadel.rotation.y = -0.35; // angled toward camera to show deep 3D facets
    scene.add(artifactCitadel);

    // Sub-assemblies
    const coreAssembly = new THREE.Group();
    const shardsGimbal = new THREE.Group();
    const yeroWingsLeft = new THREE.Group();
    const yeroWingsRight = new THREE.Group();
    const polaroidAperture = new THREE.Group();
    const demolitionFoundation = new THREE.Group();
    const thunderSpireCrown = new THREE.Group();

    coreAssembly.add(shardsGimbal);
    artifactCitadel.add(coreAssembly);
    artifactCitadel.add(yeroWingsLeft);
    artifactCitadel.add(yeroWingsRight);
    artifactCitadel.add(polaroidAperture);
    artifactCitadel.add(demolitionFoundation);
    artifactCitadel.add(thunderSpireCrown);

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

          let yeroIdx = 0;

          rawObjects.forEach((obj: any) => {
            const name = obj.name || "";

            // Override and enhance materials: bright, colorful, vibrant specular highlights (NEVER dark/black)
            obj.traverse((child: any) => {
              if (child.isMesh) {
                const childName = (child.name || name || "").toLowerCase();

                if (childName.includes("monolith")) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x384a66), // Luminous slate blue-grey
                    metalness: 0.22,
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
                    emissiveIntensity: 3.5,
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
                    emissiveIntensity: 3.0,
                    transparent: true,
                    opacity: 0.95,
                  });
                }
              }
            });

            // Mount into dedicated sub-assembly of the Unfolding Artifact Citadel
            if (name.includes("StormMonolith") || name.includes("InnerPlasmaCore")) {
              coreAssembly.add(obj);
            } else if (name.includes("OrbitalShard")) {
              shardsGimbal.add(obj);
            } else if (name.includes("TumblingYero")) {
              // Split 6 yero sheets between left wing and right wing
              if (yeroIdx % 2 === 0) {
                yeroWingsLeft.add(obj);
              } else {
                yeroWingsRight.add(obj);
              }
              yeroIdx++;
            } else if (name.includes("MemoryPolaroid")) {
              obj.rotation.x = Math.PI / 2;
              polaroidAperture.add(obj);

              // Vivid storm photo insert on the front face of the polaroid
              const photoGeom = new THREE.PlaneGeometry(0.96, 1.18);
              const photoMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0x38bdf8),
                side: THREE.DoubleSide,
              });
              const photoMesh = new THREE.Mesh(photoGeom, photoMat);
              photoMesh.position.set(0, 0.08, 0.025);
              polaroidAperture.add(photoMesh);
            } else if (name.includes("ConcreteBlock") || name.includes("RebarRod")) {
              demolitionFoundation.add(obj);
            } else if (name.includes("CrystalSpike")) {
              thunderSpireCrown.add(obj);
            } else {
              coreAssembly.add(obj);
            }
          });

          // Initial positions of retracted sub-assemblies inside the Citadel
          coreAssembly.scale.set(1.0, 1.0, 1.0);
          yeroWingsLeft.scale.set(0.01, 0.01, 0.01);
          yeroWingsRight.scale.set(0.01, 0.01, 0.01);
          polaroidAperture.scale.set(0.01, 0.01, 0.01);
          demolitionFoundation.scale.set(0.01, 0.01, 0.01);
          thunderSpireCrown.scale.set(0.01, 0.01, 0.01);
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
      artifactCitadel,
      coreAssembly,
      shardsGimbal,
      yeroWingsLeft,
      yeroWingsRight,
      polaroidAperture,
      demolitionFoundation,
      thunderSpireCrown,
      pointLight,
      hemiLight,
      keyLight,
      rimLight,
      coreAccentLight,
    };

    return () => {
      artifactCitadel.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      scene.remove(artifactCitadel);
      renderer.dispose();
      contextRef.current = null;
    };
  }, [width, height]);

  // Per-frame unfolding animation & living simulation
  useLayoutEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const {
      renderer,
      scene,
      threeCamera,
      artifactCitadel,
      coreAssembly,
      shardsGimbal,
      yeroWingsLeft,
      yeroWingsRight,
      polaroidAperture,
      demolitionFoundation,
      thunderSpireCrown,
      pointLight,
      hemiLight,
      keyLight,
      rimLight,
      coreAccentLight,
    } = ctx;

    // Follow camera orientation with smooth parallax scaling
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;
    threeCamera.rotation.y = (-camera.ry * Math.PI) / 180 * 0.7;
    threeCamera.rotation.x = (-camera.rx * Math.PI) / 180 * 0.7;
    threeCamera.rotation.z = (-camera.rz * Math.PI) / 180 * 0.7;

    // =========================================================================
    // STORYBOARD UNFOLDING LIFECYCLE (UNFOLDS PROGRESSIVELY AS SONG ADVANCES)
    // =========================================================================

    // Stage 1: Shards expansion & awakening (Intro -> Verse 1: frames 0 -> 900)
    const shardsDeploy = interpolate(frame, [0, 900], [0.35, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Stage 2: Aerodynamic Yero Wings deploy (Chorus 1 - "Tatangayin ko bawat yero": frames 1650 -> 1850)
    const yeroDeploy = interpolate(frame, [1650, 1850], [0.0, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Stage 3: Memory Polaroid Aperture swings forward (Verse 2 - "Itinago na litrato": frames 2650 -> 2850)
    const polaroidDeploy = interpolate(frame, [2650, 2850], [0.0, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Stage 4: Heavy Demolition Base & Rebars extend (Chorus 2 - "Gigibain ko mga pader n'yo": frames 3650 -> 3850)
    const demolitionDeploy = interpolate(frame, [3650, 3850], [0.0, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Stage 5: Apex Thunder Spire telescopes upward (Bridge Climax - "Ako, ako ang bagyo": frames 5450 -> 5750)
    const crystalDeploy = interpolate(frame, [5450, 5750], [0.0, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // =========================================================================
    // DYNAMIC CITADEL MOTION & MECHANICAL UNROLLING
    // =========================================================================

    // Overall Citadel scale grows as more components unlock
    const citadelScale = 38 * (1.0 + crystalDeploy * 0.15);
    artifactCitadel.scale.set(citadelScale, citadelScale, citadelScale);

    // Living floating hover drift in upper-right sky (frames the typography corridor)
    artifactCitadel.position.x = 460 + Math.sin(frame * 0.006) * 20;
    artifactCitadel.position.y = 110 + Math.cos(frame * 0.007) * 16;
    artifactCitadel.rotation.y = -0.35 + Math.sin(frame * 0.005) * 0.08;
    artifactCitadel.rotation.x = 0.08 + Math.cos(frame * 0.008) * 0.05;

    // 1. Core & Orbital Shards
    if (coreAssembly.children.length > 0) {
      coreAssembly.rotation.y = frame * 0.008;

      shardsGimbal.rotation.y = frame * 0.025;
      shardsGimbal.rotation.x = 0.45 + Math.sin(frame * 0.01) * 0.12;
      const shardScale = 1.0 + shardsDeploy * 0.4;
      shardsGimbal.scale.set(shardScale, shardScale, shardScale);

      coreAssembly.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.emissive) {
          const isCore =
            (child.name || "").toLowerCase().includes("core") ||
            (child.name || "").toLowerCase().includes("shard");
          child.material.emissiveIntensity = isLightningActive
            ? (isCore ? 7.0 : 1.8)
            : (isCore ? 3.5 : 0.6);
        }
      });
    }

    // 2. Yero Wings Unfolding (Chorus 1: Aerodynamic Wind Vanes)
    if (yeroWingsLeft.children.length > 0) {
      if (yeroDeploy > 0.001) {
        yeroWingsLeft.visible = true;
        yeroWingsRight.visible = true;

        // Deploy outward from the flanks
        const wingSpan = 1.2 + yeroDeploy * 3.6;
        yeroWingsLeft.position.x = -wingSpan;
        yeroWingsLeft.position.y = yeroDeploy * 0.6;
        yeroWingsLeft.rotation.z = yeroDeploy * 0.4 + Math.sin(frame * 0.03) * 0.1;
        yeroWingsLeft.rotation.y = Math.sin(frame * 0.04) * 0.25;
        yeroWingsLeft.scale.set(yeroDeploy * 1.8, yeroDeploy * 1.8, yeroDeploy * 1.8);

        yeroWingsRight.position.x = wingSpan;
        yeroWingsRight.position.y = yeroDeploy * 0.6;
        yeroWingsRight.rotation.z = -yeroDeploy * 0.4 - Math.sin(frame * 0.03) * 0.1;
        yeroWingsRight.rotation.y = -Math.sin(frame * 0.04) * 0.25;
        yeroWingsRight.scale.set(yeroDeploy * 1.8, yeroDeploy * 1.8, yeroDeploy * 1.8);
      } else {
        yeroWingsLeft.visible = false;
        yeroWingsRight.visible = false;
      }
    }

    // 3. Memory Polaroid Aperture Unfolding (Verse 2: Floating Memory Relic)
    if (polaroidAperture.children.length > 0) {
      if (polaroidDeploy > 0.001) {
        polaroidAperture.visible = true;

        // Swings forward on an articulated arm
        polaroidAperture.position.x = -2.2 - polaroidDeploy * 2.5;
        polaroidAperture.position.y = -0.3 + polaroidDeploy * 1.1;
        polaroidAperture.position.z = 1.2 + polaroidDeploy * 2.2;
        polaroidAperture.rotation.y = 0.4 + Math.sin(frame * 0.015) * 0.1;
        polaroidAperture.rotation.z = -0.22 + Math.sin(frame * 0.012) * 0.06;
        const pScale = polaroidDeploy * 1.6;
        polaroidAperture.scale.set(pScale, pScale, pScale);
      } else {
        polaroidAperture.visible = false;
      }
    }

    // 4. Heavy Demolition Foundation & Rebars (Chorus 2: Seismic Anchors)
    if (demolitionFoundation.children.length > 0) {
      if (demolitionDeploy > 0.001) {
        demolitionFoundation.visible = true;

        // Structural bass drop tremors
        const tremor =
          (Math.sin(frame * 0.8) * 0.1 + Math.cos(frame * 1.4) * 0.08) *
          (isLightningActive ? 3.0 : 1.0);

        demolitionFoundation.position.y = -2.8 - demolitionDeploy * 2.2 + tremor;
        demolitionFoundation.rotation.y = frame * 0.005;
        const dScale = demolitionDeploy * 1.3;
        demolitionFoundation.scale.set(dScale, dScale, dScale);
      } else {
        demolitionFoundation.visible = false;
      }
    }

    // 5. Apex Thunder Crystal Spire (Bridge Climax: Lightning Conductor)
    if (thunderSpireCrown.children.length > 0) {
      if (crystalDeploy > 0.001) {
        thunderSpireCrown.visible = true;

        // Telescopes upward into the sky
        thunderSpireCrown.position.y = 3.2 + crystalDeploy * 3.4;
        thunderSpireCrown.rotation.y = -frame * 0.025;
        const cScale = crystalDeploy * 1.2;
        thunderSpireCrown.scale.set(cScale, cScale, cScale);

        thunderSpireCrown.traverse((child: any) => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissiveIntensity = isLightningActive ? 8.0 : 3.5;
          }
        });
      } else {
        thunderSpireCrown.visible = false;
      }
    }

    // =========================================================================
    // DYNAMIC STORM LIGHTING RIG
    // =========================================================================
    if (isLightningActive) {
      hemiLight.intensity = 5.8;
      keyLight.intensity = 8.5;
      rimLight.intensity = 6.5;
      pointLight.intensity = 9.5;
      pointLight.color.set(accentColor);
      coreAccentLight.intensity = 8.5;
      coreAccentLight.color.set(accentColor);
    } else {
      hemiLight.intensity = 3.6;
      keyLight.intensity = 4.4;
      rimLight.intensity = 3.6;
      pointLight.intensity = 2.5;
      pointLight.color.setHex(0x00f0ff);
      coreAccentLight.intensity = 4.2;
      coreAccentLight.color.setHex(0x00f0ff);
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
