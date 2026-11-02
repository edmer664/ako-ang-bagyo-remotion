import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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

  // Remotion render barrier to guarantee GLTF meshes are parsed and added to scene before capture
  const [handle] = useState(() =>
    delayRender("ThreeBackgroundMonolith_GLTF_Parse")
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const hasContinuedRef = useRef(false);

  const safeContinueRender = useCallback(() => {
    if (!hasContinuedRef.current) {
      hasContinuedRef.current = true;
      continueRender(handle);
    }
  }, [handle]);

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

  // Initialize WebGL Scene & Load GLTF Model
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
      safeContinueRender();
      return;
    }

    const scene = new THREE.Scene();

    // Atmospheric depth fog - seamlessly merges distant geometry with storm horizon
    scene.fog = new THREE.FogExp2(0x060c18, 0.0012);

    const threeCamera = new THREE.PerspectiveCamera(68, width / height, 10, 5000);
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
    // Positioned at X = 745 to match the Triad corridor clearance anchor
    const coreAccentLight = new THREE.PointLight(0x00f0ff, 4.2, 1200);
    coreAccentLight.position.set(745, 120, -100);
    scene.add(coreAccentLight);

    // =========================================================================
    // UNIFIED UNFOLDING ARTIFACT CITADEL HIERARCHY
    // Anchor shifted to X = +745px, Y = +110px, Z = -200px (Triad Fix Strategy)
    // =========================================================================
    const artifactCitadel = new THREE.Group();
    artifactCitadel.position.set(745, 110, -200);
    artifactCitadel.rotation.y = -0.35; // angled toward camera to show deep 3D facets
    scene.add(artifactCitadel);

    // Sub-assemblies corresponding to the 5 Storyboard Stages
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

    // Start subsequent stages strictly hidden until their sequential frame arrival
    yeroWingsLeft.visible = false;
    yeroWingsRight.visible = false;
    polaroidAperture.visible = false;
    demolitionFoundation.visible = false;
    thunderSpireCrown.visible = false;

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

          let shardIdx = 0;
          let yeroIdx = 0;

          rawObjects.forEach((obj: THREE.Object3D) => {
            const name = obj.name || "";

            // Override and enhance materials: bright, colorful, vibrant specular highlights (NEVER dark/black)
            obj.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
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

            // Mount into dedicated sub-assembly with clean, organized local coordinates (NO JUMBLED CLIPPING)
            if (name.includes("StormMonolith")) {
              obj.position.set(0, 0, 0);
              obj.rotation.set(0, 0, 0);
              coreAssembly.add(obj);
            } else if (name.includes("InnerPlasmaCore")) {
              obj.position.set(0, 0, 0);
              obj.rotation.set(0, 0, 0);
              coreAssembly.add(obj);
            } else if (name.includes("OrbitalShard")) {
              // Procedurally distribute 12 shards in a clean orbital gimbal ring
              const i = shardIdx++;
              const theta = (i / 12) * Math.PI * 2;
              const radius = 2.4;
              const yPos = Math.sin(i * 1.5) * 1.4;
              obj.position.set(Math.cos(theta) * radius, yPos, Math.sin(theta) * radius);
              obj.rotation.set(0.3 * i, 0.5 * i, 0);
              shardsGimbal.add(obj);
            } else if (name.includes("TumblingYero")) {
              // 6 Corrugated galvanized metal sheets arranged into 2 sweeping aerodynamic wings
              const sheetIdxInWing = Math.floor(yeroIdx / 2); // 0, 1, 2
              const isLeft = yeroIdx % 2 === 0;

              if (isLeft) {
                // Stepped tier along left wing flank (Triad Fix: clamped to -0.5 to clear Tier 1 corridor)
                const stepX = -sheetIdxInWing * 0.5;
                const stepY = sheetIdxInWing * 0.4;
                const stepZ = -sheetIdxInWing * 0.15;
                const tiltZ = 0.15 + sheetIdxInWing * 0.16;
                obj.position.set(stepX, stepY, stepZ);
                obj.rotation.set(0.1, 0, tiltZ);
                yeroWingsLeft.add(obj);
              } else {
                // Stepped tier along right wing flank (full dramatic theatrical deployment)
                const stepX = sheetIdxInWing * 1.1;
                const stepY = sheetIdxInWing * 0.4;
                const stepZ = -sheetIdxInWing * 0.15;
                const tiltZ = -0.15 - sheetIdxInWing * 0.16;
                obj.position.set(stepX, stepY, stepZ);
                obj.rotation.set(0.1, 0, tiltZ);
                yeroWingsRight.add(obj);
              }
              yeroIdx++;
            } else if (name.includes("MemoryPolaroid")) {
              obj.position.set(0, 0, 0);
              obj.rotation.set(Math.PI / 2, 0, 0);
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

              // Articulated mechanical cradle arm connecting to monolith flank
              const strutGeom = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8);
              const strutMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x334155),
                metalness: 0.8,
                roughness: 0.3,
              });
              const strut = new THREE.Mesh(strutGeom, strutMat);
              strut.position.set(1.4, -0.4, -1.2);
              strut.rotation.set(0.4, -0.6, 1.1);
              polaroidAperture.add(strut);
            } else if (name.includes("ConcreteBlock")) {
              obj.position.set(0, 0, 0);
              obj.rotation.set(0, 0, 0);
              obj.scale.set(1.6, 1.1, 1.6);
              demolitionFoundation.add(obj);

              // Pneumatic piston rods extending from monolith base into concrete foundation
              const pistonGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 12);
              const pistonMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x94a3b8),
                metalness: 0.85,
                roughness: 0.2,
              });
              const pistonL = new THREE.Mesh(pistonGeom, pistonMat);
              pistonL.position.set(-0.6, 1.4, 0);
              demolitionFoundation.add(pistonL);

              const pistonR = new THREE.Mesh(pistonGeom, pistonMat);
              pistonR.position.set(0.6, 1.4, 0);
              demolitionFoundation.add(pistonR);
            } else if (name.includes("RebarRod")) {
              const isFirst = name.includes("_0");
              obj.position.set(isFirst ? -0.55 : 0.55, 0.6, isFirst ? 0.2 : -0.2);
              obj.rotation.set(isFirst ? 0.1 : -0.1, 0, isFirst ? 0.12 : -0.12);
              obj.scale.set(1.4, 1.8, 1.4);
              demolitionFoundation.add(obj);
            } else if (name.includes("CrystalSpike")) {
              obj.position.set(0, 0, 0);
              obj.rotation.set(0, 0, 0);
              obj.scale.set(1.4, 1.8, 1.4);
              thunderSpireCrown.add(obj);
            } else {
              coreAssembly.add(obj);
            }
          });

          // All meshes added to scene: update state to trigger per-frame render
          setIsLoaded(true);
        },
        (error) => {
          console.warn("Failed to parse storyboard GLB:", error);
          safeContinueRender();
        }
      );
    } catch (err) {
      console.warn("Error loading storyboard assets:", err);
      safeContinueRender();
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
      safeContinueRender();
      artifactCitadel.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      scene.remove(artifactCitadel);
      renderer.dispose();
      contextRef.current = null;
    };
  }, [width, height, safeContinueRender]);

  // Per-frame unfolding animation & living simulation strictly matching storyboard sequence
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

    // Follow camera orientation with Triad Fix decoupling:
    // gamma_ry dampened from 0.70 to 0.12, position.x scaled to 0.08
    threeCamera.position.x = camera.x * 0.08;
    threeCamera.position.y = -camera.y * 0.08;
    threeCamera.rotation.y = ((-camera.ry * Math.PI) / 180) * 0.12;
    threeCamera.rotation.x = ((-camera.rx * Math.PI) / 180) * 0.12;
    threeCamera.rotation.z = ((-camera.rz * Math.PI) / 180) * 0.12;

    // =========================================================================
    // SEQUENTIAL LIFECYCLE PROGRESSION (UNFOLDS PROGRESSIVELY IN EXACT STAGES)
    // =========================================================================

    // Stage 1: Shards expansion & awakening (Intro & Verse 1: frames 0 -> 900)
    // Orbital gimbal radius expands smoothly from 0.35 to 1.0
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
    // DYNAMIC CITADEL MOTION & ARTICULATION
    // =========================================================================

    // Overall Citadel scale grows subtly as more components unlock
    const citadelScale = 38 * (1.0 + crystalDeploy * 0.15);
    artifactCitadel.scale.set(citadelScale, citadelScale, citadelScale);

    // Living floating hover drift anchored at X = +745px (Triad Corridor Clearance)
    artifactCitadel.position.x = 745 + Math.sin(frame * 0.006) * 20;
    artifactCitadel.position.y = 110 + Math.cos(frame * 0.007) * 16;
    artifactCitadel.rotation.y = -0.35 + Math.sin(frame * 0.005) * 0.08;
    artifactCitadel.rotation.x = 0.08 + Math.cos(frame * 0.008) * 0.05;

    // -------------------------------------------------------------------------
    // 1. STAGE 1: DORMANT CORE & ORBITAL SHARDS (Active throughout entire song)
    // -------------------------------------------------------------------------
    if (coreAssembly.children.length > 0) {
      coreAssembly.rotation.y = frame * 0.008;

      shardsGimbal.rotation.y = frame * 0.025;
      shardsGimbal.rotation.x = 0.45 + Math.sin(frame * 0.01) * 0.12;

      // Orbital gimbal radius expands from 0.35 to 1.0
      shardsGimbal.scale.set(shardsDeploy, shardsDeploy, shardsDeploy);
    }

    // -------------------------------------------------------------------------
    // 2. STAGE 2: AERODYNAMIC YERO WINGS (Appears strictly on Chorus 1, Frame >= 1650)
    // -------------------------------------------------------------------------
    if (frame >= 1650 && yeroDeploy > 0.001) {
      yeroWingsLeft.visible = true;
      yeroWingsRight.visible = true;

      // Asymmetric Triad Fix: Left wing clamped to 2.4, Right wing deployed to 4.8
      const wingSpanL = 1.2 + yeroDeploy * 1.2;
      const wingSpanR = 1.2 + yeroDeploy * 3.6;

      // Aerodynamic flutter
      const windFlutterL = Math.sin(frame * 0.12) * 0.08;
      const windFlutterR = -Math.sin(frame * 0.12 + 0.5) * 0.08;

      yeroWingsLeft.position.x = -wingSpanL;
      yeroWingsLeft.position.y = 0.4 + yeroDeploy * 0.5;
      yeroWingsLeft.rotation.z = yeroDeploy * 0.35 + windFlutterL;
      yeroWingsLeft.rotation.y = Math.cos(frame * 0.08) * 0.15;
      yeroWingsLeft.scale.set(yeroDeploy, yeroDeploy, yeroDeploy);

      yeroWingsRight.position.x = wingSpanR;
      yeroWingsRight.position.y = 0.4 + yeroDeploy * 0.5;
      yeroWingsRight.rotation.z = -yeroDeploy * 0.35 + windFlutterR;
      yeroWingsRight.rotation.y = -Math.cos(frame * 0.08) * 0.15;
      yeroWingsRight.scale.set(yeroDeploy, yeroDeploy, yeroDeploy);
    } else {
      yeroWingsLeft.visible = false;
      yeroWingsRight.visible = false;
    }

    // -------------------------------------------------------------------------
    // 3. STAGE 3: MEMORY POLAROID APERTURE (Appears strictly on Verse 2, Frame >= 2650)
    // -------------------------------------------------------------------------
    if (frame >= 2650 && polaroidDeploy > 0.001) {
      polaroidAperture.visible = true;

      // Articulated mechanical cradle: Triad Fix clamps position.x to -1.2 - polaroidDeploy * 1.0 (max -2.2)
      polaroidAperture.position.x = -1.2 - polaroidDeploy * 1.0;
      polaroidAperture.position.y = 0.1 + polaroidDeploy * 0.7;
      polaroidAperture.position.z = 0.5 + polaroidDeploy * 2.9;

      // Angled cleanly to face camera with distinct photographic framing
      polaroidAperture.rotation.y = 0.48 + Math.sin(frame * 0.02) * 0.05;
      polaroidAperture.rotation.x = -0.1 + Math.cos(frame * 0.015) * 0.04;
      polaroidAperture.rotation.z = -0.15;

      const pScale = polaroidDeploy * 1.5;
      polaroidAperture.scale.set(pScale, pScale, pScale);
    } else {
      polaroidAperture.visible = false;
    }

    // -------------------------------------------------------------------------
    // 4. STAGE 4: HEAVY DEMOLITION FOUNDATION & REBARS (Appears on Chorus 2, Frame >= 3650)
    // -------------------------------------------------------------------------
    if (frame >= 3650 && demolitionDeploy > 0.001) {
      demolitionFoundation.visible = true;

      // Structural bass drop shockwaves and rumble
      const tremor =
        (Math.sin(frame * 0.9) * 0.08 + Math.cos(frame * 1.5) * 0.06) *
        (isLightningActive ? 2.5 : 1.0);

      // Heavy pneumatic pistons extend downward beneath chassis (y = -2.8 -> -5.0)
      demolitionFoundation.position.y = -2.8 - demolitionDeploy * 2.2 + tremor;
      demolitionFoundation.position.x = 0;
      demolitionFoundation.position.z = 0;
      demolitionFoundation.rotation.y = frame * 0.006;

      const dScale = demolitionDeploy * 1.25;
      demolitionFoundation.scale.set(dScale, dScale, dScale);
    } else {
      demolitionFoundation.visible = false;
    }

    // -------------------------------------------------------------------------
    // 5. STAGE 5: APEX THUNDER CRYSTAL SPIRE (Appears on Bridge Climax, Frame >= 5450)
    // -------------------------------------------------------------------------
    if (frame >= 5450 && crystalDeploy > 0.001) {
      thunderSpireCrown.visible = true;

      // Spire telescopes high into the storm sky (y = +3.2 -> +6.6)
      thunderSpireCrown.position.y = 3.2 + crystalDeploy * 3.4;
      thunderSpireCrown.position.x = 0;
      thunderSpireCrown.position.z = 0;
      thunderSpireCrown.rotation.y = -frame * 0.03;

      const cScale = crystalDeploy * 1.35;
      thunderSpireCrown.scale.set(cScale, cScale, cScale);
    } else {
      thunderSpireCrown.visible = false;
    }

    // =========================================================================
    // DYNAMIC STORM LIGHTING RIG
    // Key light surges up to 8.5, Point light surges up to 9.5 during strikes
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

    // =========================================================================
    // DYNAMIC MATERIAL EMISSIVE SYNCHRONIZATION (8 ZERO-UNLIT PBR MATERIALS)
    // =========================================================================
    artifactCitadel.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (!mat.emissive) return;

        const childName = (child.name || "").toLowerCase();

        if (childName.includes("plasmacore") || childName.includes("shard")) {
          // Inner Plasma Core & Orbital Shards: baseline 3.5 -> strike surge 7.0
          mat.emissiveIntensity = isLightningActive ? 7.0 : 3.5;
          mat.emissive.set(isLightningActive ? accentColor : "#00f5ff");
        } else if (childName.includes("crystal")) {
          // Apex Crystal Spike: baseline 3.0 (with vocal pulse) -> strike surge 8.0
          const vocalPulse = 3.5 + Math.sin(frame * 0.25) * 1.8;
          mat.emissiveIntensity = isLightningActive ? 8.0 : vocalPulse;
          mat.emissive.set(isLightningActive ? accentColor : "#00f5ff");
        } else if (childName.includes("monolith")) {
          // Basalt Monolith Tower: baseline 0.5 -> strike surge 1.8
          mat.emissiveIntensity = isLightningActive ? 1.8 : 0.5;
        } else if (childName.includes("yero")) {
          // Corrugated Yero Sheets: baseline 0.25 -> strike surge 1.2
          mat.emissiveIntensity = isLightningActive ? 1.2 : 0.25;
        } else if (childName.includes("polaroid")) {
          // Memory Polaroid Frame: baseline 0.4 -> strike surge 1.5
          mat.emissiveIntensity = isLightningActive ? 1.5 : 0.4;
        } else if (childName.includes("rebar")) {
          // Industrial Rust Rebar: baseline 0.6 -> strike surge 2.2
          mat.emissiveIntensity = isLightningActive ? 2.2 : 0.6;
        } else if (childName.includes("concrete")) {
          // Demolition Concrete Block: baseline 0.2 -> strike surge 0.8
          mat.emissiveIntensity = isLightningActive ? 0.8 : 0.2;
        }
      }
    });

    renderer.render(scene, threeCamera);

    // Frame is fully rendered to WebGL canvas buffer: release Remotion render barrier
    if (isLoaded) {
      safeContinueRender();
    }
  }, [frame, camera, isLightningActive, accentColor, isLoaded, safeContinueRender]);

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
