import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  continueRender,
  delayRender,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STORM_ASSETS_BASE64 } from "../assets/stormStoryboardAssetsBase64";
import { SpatialCoord } from "../lyricsData";

interface StoryboardBackgroundProps {
  camera: SpatialCoord;
  activeSection: string;
  accentColor: string;
  isLightningActive?: boolean;
}

const INSTANCED_DEBRIS_COUNT = 96;
const CELESTIAL_PARTICLES_COUNT = 180;

export const ThreeStoryboardBackground: React.FC<StoryboardBackgroundProps> = ({
  camera,
  activeSection,
  accentColor,
  isLightningActive = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [handle] = useState(() =>
    delayRender("ThreeStoryboardBackground_Init")
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
    skyDomeMesh: THREE.Mesh;
    skyDomeShaderMaterial: THREE.ShaderMaterial;
    textures: Record<string, THREE.Texture>;
    // Environmental 3D Assemblies
    rightCitadel: THREE.Group;
    leftMonolith: THREE.Group;
    cycloneRings: THREE.Group;
    shardsGroup: THREE.Group;
    hazardPylonsGroup: THREE.Group;
    rooftopHorizonGroup: THREE.Group;
    yeroSheetsGroup: THREE.Group;
    memoryGroup: THREE.Group;
    demolitionGroup: THREE.Group;
    bridgeSpireGroup: THREE.Group;
    skyTrussGroup: THREE.Group;
    debrisInstancedMesh: THREE.InstancedMesh;
    debrisVelocities: Float32Array;
    celestialParticles: THREE.Points;
    celestialPositions: Float32Array;
    // Lights
    hemiLight: THREE.HemisphereLight;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    kickLight: THREE.DirectionalLight;
    pointLight: THREE.PointLight;
    accentLight: THREE.PointLight;
  } | null>(null);

  // Initialize WebGL Scene, Shaders, Physical Materials, and Instanced Debris
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
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch {
      safeContinueRender();
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040914, 0.00055);

    const threeCamera = new THREE.PerspectiveCamera(65, width / height, 10, 9500);
    threeCamera.rotation.order = "YXZ";
    threeCamera.position.set(0, 0, 500);

    // 1. DYNAMIC STUDIO LIGHTING RIG (Kram.Visuals / Apple 3D Motion Graphics Standard)
    // Hemisphere fill ensures zero unlit surfaces and maintains broadcast luminance floor
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0c1527, 4.2);
    scene.add(hemiLight);

    // Key Light: Sharp directional sun/lightning key casting crisp specular highlights on bevels
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.4);
    keyLight.position.set(520, 680, 460);
    scene.add(keyLight);

    // Rim Light 1: Cool electric cyan kick light separating left flank geometry from the abyss
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 4.8);
    rimLight.position.set(-640, -280, 280);
    scene.add(rimLight);

    // Rim Light 2: Dynamic section accent rim light hitting right flank citadel bevels
    const kickLight = new THREE.DirectionalLight(0x38bdf8, 4.2);
    kickLight.position.set(640, -200, 260);
    scene.add(kickLight);

    // Point Light 1: Volumetric core point light inside the eye of the storm
    const pointLight = new THREE.PointLight(0x00f0ff, 4.0, 4200);
    pointLight.position.set(0, 80, -180);
    scene.add(pointLight);

    // Point Light 2: Right Citadel focal highlight
    const accentLight = new THREE.PointLight(0x00f0ff, 5.2, 2400);
    accentLight.position.set(740, 110, -100);
    scene.add(accentLight);

    // 2. CURVED PANORAMIC SKY DOME WITH ENHANCED FBM TURBULENCE & GOD-RAY GLSL SHADER
    const textureLoader = new THREE.TextureLoader();
    const texturePaths: Record<string, string> = {
      hero: staticFile("assets/ako_ang_bagyo_storm_concept.jpg"),
      hazard: staticFile("assets/scene_prechorus_hazard.jpg"),
      yero: staticFile("assets/scene_chorus1_yero.jpg"),
      memory: staticFile("assets/scene_verse2_memory.jpg"),
      demolition: staticFile("assets/scene_chorus2_demolition.jpg"),
      bridge: staticFile("assets/scene_bridge_celestial.jpg"),
    };

    const loadedTextures: Record<string, THREE.Texture> = {};
    let texturesToLoad = Object.keys(texturePaths).length;

    const onTextureLoaded = () => {
      texturesToLoad--;
      if (texturesToLoad <= 0) {
        checkAllLoaded();
      }
    };

    for (const [key, path] of Object.entries(texturePaths)) {
      const tex = textureLoader.load(
        path,
        () => onTextureLoaded(),
        undefined,
        () => onTextureLoaded()
      );
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      loadedTextures[key] = tex;
    }

    const domeRadius = 2750;
    const domeHeight = 2400;
    const domeGeo = new THREE.CylinderGeometry(
      domeRadius,
      domeRadius,
      domeHeight,
      64,
      1,
      true,
      -Math.PI * 0.44,
      Math.PI * 0.88
    );
    domeGeo.scale(-1, 1, 1); // Invert so inside is visible

    const skyDomeShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: loadedTextures.hero },
        time: { value: 0 },
        lightningSurge: { value: 0.0 },
        accentColor: { value: new THREE.Color(0x00f0ff) },
        opacity: { value: 0.98 },
        sectionIntensity: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform float time;
        uniform float lightningSurge;
        uniform vec3 accentColor;
        uniform float opacity;
        uniform float sectionIntensity;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        // Hash and 2D Noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        // Fractional Brownian Motion for multi-octave atmospheric turbulence
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.0 + vec2(100.0);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Dynamic storm cloud drift
          vec2 uvDrift = vUv;
          uvDrift.x += sin(vUv.y * 3.14159 + time * 0.07) * 0.015;
          uvDrift.y += cos(vUv.x * 3.14159 + time * 0.05) * 0.009;

          vec4 texColor = texture(map, uvDrift);

          // Multi-layered cloud shelf turbulence
          float cloudNoise = fbm(vUv * 6.0 + vec2(time * 0.03, time * 0.015));
          texColor.rgb += accentColor * (cloudNoise * 0.16 * sectionIntensity);

          // Radial Crepuscular God Rays radiating from the central storm eye
          vec2 eyeCenter = vec2(0.5, 0.52);
          vec2 rayDir = vUv - eyeCenter;
          float distToEye = length(rayDir);
          float angle = atan(rayDir.y, rayDir.x);
          float godRays = sin(angle * 12.0 + time * 0.12) * cos(angle * 6.0 - time * 0.08);
          godRays = max(0.0, godRays) * smoothstep(0.85, 0.1, distToEye);
          texColor.rgb += accentColor * (godRays * 0.22);

          // Dynamic lightning discharge veins across cloud shelves
          if (lightningSurge > 0.01) {
            float veinNoise1 = fbm(vUv * 14.0 + vec2(0.0, -time * 0.25));
            float strikeVein = pow(veinNoise1, 3.2);
            vec3 lightningGlow = vec3(0.92, 0.97, 1.0) * (lightningSurge * 0.65 + strikeVein * lightningSurge * 2.2);
            texColor.rgb += lightningGlow;
          }

          // Filmic edge vignette to frame the scene
          float vignette = 1.0 - smoothstep(0.3, 0.85, distToEye) * 0.25;
          texColor.rgb *= vignette;

          gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const skyDomeMesh = new THREE.Mesh(domeGeo, skyDomeShaderMaterial);
    skyDomeMesh.position.set(0, 0, -850);
    scene.add(skyDomeMesh);

    // 3. SCENE STAGE GROUPS
    const rightCitadel = new THREE.Group();
    rightCitadel.position.set(745, 110, -200);
    rightCitadel.rotation.y = -0.35;

    const leftMonolith = new THREE.Group();
    leftMonolith.position.set(-780, 130, -300);
    leftMonolith.rotation.y = 0.35;

    const cycloneRings = new THREE.Group();
    const shardsGroup = new THREE.Group();
    const hazardPylonsGroup = new THREE.Group();
    const rooftopHorizonGroup = new THREE.Group();
    const yeroSheetsGroup = new THREE.Group();
    const memoryGroup = new THREE.Group();
    const demolitionGroup = new THREE.Group();
    const bridgeSpireGroup = new THREE.Group();
    const skyTrussGroup = new THREE.Group();

    scene.add(rightCitadel);
    scene.add(leftMonolith);
    scene.add(cycloneRings);
    scene.add(shardsGroup);
    scene.add(hazardPylonsGroup);
    scene.add(rooftopHorizonGroup);
    scene.add(yeroSheetsGroup);
    scene.add(memoryGroup);
    scene.add(demolitionGroup);
    scene.add(bridgeSpireGroup);
    scene.add(skyTrussGroup);

    // 4. UPPER-THIRD OVERHANGING STORM TRUSSES & ARCHES (Kram.Visuals Brutalist Trusses)
    const trussMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.28,
      metalness: 0.68,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.32,
    });
    const strutMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6,
      emissive: new THREE.Color(0x0088ff),
      emissiveIntensity: 0.2,
    });

    for (let i = 0; i < 3; i++) {
      const archGroup = new THREE.Group();
      const archGeo = new THREE.TorusGeometry(1250 + i * 220, 20, 8, 44, Math.PI);
      const arch = new THREE.Mesh(archGeo, trussMat);
      archGroup.add(arch);

      // Procedural cross-struts on the industrial arches
      for (let s = 0; s < 7; s++) {
        const strutGeo = new THREE.CylinderGeometry(4, 4, 180, 6);
        const strut = new THREE.Mesh(strutGeo, strutMat);
        const angle = -Math.PI * 0.4 + s * (Math.PI * 0.8 / 6);
        const r = 1250 + i * 220;
        strut.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
        strut.rotation.z = angle + Math.PI / 2;
        archGroup.add(strut);
      }

      archGroup.position.set(0, -420, -500 - i * 320);
      archGroup.rotation.x = Math.PI * 0.95;
      skyTrussGroup.add(archGroup);
    }

    // 5. CONCENTRIC CYCLONE GYRE RINGS (Deep Space Z: -800 to -2000)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.55,
      wireframe: true,
    });
    for (let r = 0; r < 5; r++) {
      const radius = 800 + r * 300;
      const ringGeo = new THREE.TorusGeometry(radius, 7, 8, 56);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 0, -800 - r * 300);
      cycloneRings.add(ringMesh);
    }

    // 6. LOWER-THIRD ROOFTOP HORIZON (Chorus 1 Authentic Philippine Set)
    const roofPebbleMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.32,
      metalness: 0.58,
      clearcoat: 0.5,
      clearcoatRoughness: 0.18,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.25,
    });
    const ventMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.75,
      clearcoat: 0.4,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.3,
    });

    for (let i = 0; i < 6; i++) {
      const roofGroup = new THREE.Group();
      const roofGeo = new THREE.ConeGeometry(390, 165, 4);
      const roofMesh = new THREE.Mesh(roofGeo, roofPebbleMat);
      roofMesh.rotation.y = Math.PI * 0.25;
      roofMesh.rotation.x = Math.PI * 0.1;
      roofGroup.add(roofMesh);

      // Industrial cylindrical exhaust chimney
      const ventGeo = new THREE.CylinderGeometry(20, 20, 95, 8);
      const ventMesh = new THREE.Mesh(ventGeo, ventMat);
      ventMesh.position.set(70, 75, -20);
      roofGroup.add(ventMesh);

      // Spinning wind turbine vent cap
      const turbineGeo = new THREE.SphereGeometry(14, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      const turbineMesh = new THREE.Mesh(turbineGeo, ventMat);
      turbineMesh.position.set(70, 125, -20);
      roofGroup.add(turbineMesh);

      const side = i % 2 === 0 ? -1 : 1;
      roofGroup.position.set(side * (530 + i * 140), 415 + i * 15, -450 - i * 180);
      roofGroup.rotation.z = side * 0.08;
      rooftopHorizonGroup.add(roofGroup);
    }

    // 7. GPU INSTANCED DEBRIS & FLYING STORM RUBBLE (threejs-geometry skill)
    // Deterministic random generation using Remotion random()
    const debrisGeo = new THREE.DodecahedronGeometry(13, 0);
    const debrisMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.6,
      clearcoat: 0.3,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.45,
    });
    const debrisInstancedMesh = new THREE.InstancedMesh(debrisGeo, debrisMat, INSTANCED_DEBRIS_COUNT);
    const dummy = new THREE.Object3D();
    const debrisVelocities = new Float32Array(INSTANCED_DEBRIS_COUNT * 4); // vx, vy, vz, rotSpeed

    for (let i = 0; i < INSTANCED_DEBRIS_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const rnd1 = random(`debris-pos-x-${i}`);
      const rnd2 = random(`debris-pos-y-${i}`);
      const rnd3 = random(`debris-pos-z-${i}`);
      const rndScale = random(`debris-scale-${i}`);

      dummy.position.set(
        side * (520 + rnd1 * 440),
        (rnd2 - 0.5) * 800,
        -150 - rnd3 * 500
      );
      dummy.rotation.set(rnd1 * Math.PI, rnd2 * Math.PI, 0);
      const scale = 0.65 + rndScale * 1.35;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      debrisInstancedMesh.setMatrixAt(i, dummy.matrix);

      debrisVelocities[i * 4 + 0] = (random(`debris-vx-${i}`) - 0.5) * 4;
      debrisVelocities[i * 4 + 1] = -2.5 - random(`debris-vy-${i}`) * 5.5;
      debrisVelocities[i * 4 + 2] = (random(`debris-vz-${i}`) - 0.5) * 2;
      debrisVelocities[i * 4 + 3] = 0.02 + random(`debris-rot-${i}`) * 0.05;
    }
    debrisInstancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(debrisInstancedMesh);

    // 8. CELESTIAL PLASMA PARTICLE FIELD (Bridge & Outro Ascension Sparkles)
    const particleGeo = new THREE.BufferGeometry();
    const celestialPositions = new Float32Array(CELESTIAL_PARTICLES_COUNT * 3);
    for (let p = 0; p < CELESTIAL_PARTICLES_COUNT; p++) {
      const pRndX = random(`celest-x-${p}`);
      const pRndY = random(`celest-y-${p}`);
      const pRndZ = random(`celest-z-${p}`);
      const side = p % 2 === 0 ? -1 : 1;
      celestialPositions[p * 3 + 0] = side * (480 + pRndX * 520);
      celestialPositions[p * 3 + 1] = (pRndY - 0.5) * 900;
      celestialPositions[p * 3 + 2] = -120 - pRndZ * 700;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(celestialPositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const celestialParticles = new THREE.Points(particleGeo, particleMat);
    celestialParticles.visible = false;
    scene.add(celestialParticles);

    // 9. GLTF ASSET PARSING & PHYSICAL PBR CALIBRATION (Kram.Visuals Specular Metals & Glass)
    let gltfLoaded = false;
    const checkAllLoaded = () => {
      if (gltfLoaded && texturesToLoad <= 0) {
        setIsLoaded(true);
        safeContinueRender();
      }
    };

    try {
      const loader = new GLTFLoader();
      const binaryString = atob(STORM_ASSETS_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      loader.parse(
        bytes.buffer,
        "",
        (gltf) => {
          const model = gltf.scene;

          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const name = (child.name || "").toLowerCase();

              if (name.includes("yero")) {
                // Brushed Galvanized Corrugated Zinc PBR
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x94a3b8,
                  roughness: 0.18,
                  metalness: 0.86,
                  clearcoat: 0.65,
                  clearcoatRoughness: 0.14,
                  emissive: new THREE.Color(0x284868),
                  emissiveIntensity: 0.58,
                  side: THREE.DoubleSide,
                });
              } else if (name.includes("shard") || name.includes("crystal")) {
                // Refractive Translucent Quartz Crystal (Glass transmission + clearcoat)
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x38bdf8,
                  roughness: 0.07,
                  metalness: 0.1,
                  transmission: 0.82,
                  thickness: 2.2,
                  ior: 1.54,
                  attenuationColor: new THREE.Color(0x38bdf8),
                  attenuationDistance: 1.2,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.05,
                  emissive: new THREE.Color(0x00f5ff),
                  emissiveIntensity: 4.5,
                  transparent: true,
                  opacity: 0.98,
                  side: THREE.DoubleSide,
                });
              } else if (name.includes("plasmacore")) {
                // Hyper-emissive plasma core cylinder
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x00ffff,
                  roughness: 0.08,
                  metalness: 0.2,
                  emissive: new THREE.Color(0x00f5ff),
                  emissiveIntensity: 4.8,
                  side: THREE.DoubleSide,
                });
              } else if (name.includes("hazard")) {
                // Brutalist basalt hazard pylon with high-contrast crimson accents
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x1e293b,
                  roughness: 0.26,
                  metalness: 0.5,
                  clearcoat: 0.4,
                  emissive: new THREE.Color(0xff3b30),
                  emissiveIntensity: 3.2,
                  side: THREE.DoubleSide,
                });
              } else if (name.includes("rebar")) {
                // Industrial glowing heated rebar
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xf97316,
                  roughness: 0.32,
                  metalness: 0.65,
                  emissive: new THREE.Color(0xf97316),
                  emissiveIntensity: 3.6,
                  side: THREE.DoubleSide,
                });
              } else if (name.includes("concrete")) {
                // Brutalist weathered masonry with chamfered look
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x64748b,
                  roughness: 0.78,
                  metalness: 0.12,
                  clearcoat: 0.2,
                  emissive: new THREE.Color(0x14283c),
                  emissiveIntensity: 0.38,
                  side: THREE.DoubleSide,
                });
              } else {
                const mat = child.material as THREE.MeshStandardMaterial;
                mat.side = THREE.DoubleSide;
                mat.emissive = new THREE.Color(0x14283c);
                mat.emissiveIntensity = 0.38;
              }
            }
          });

          // Extract objects
          const monolithObj = model.getObjectByName("StormMonolith");
          const innerCoreObj = model.getObjectByName("InnerPlasmaCore");
          const crystalObj = model.getObjectByName("CrystalSpike");
          const hazardPylonObj = model.getObjectByName("HazardPylon");
          const mooringRopeObj = model.getObjectByName("MooringRope");
          const memoryPolaroidObj = model.getObjectByName("MemoryPolaroid");
          const concreteObj = model.getObjectByName("ConcreteBlock");
          const rebar0Obj = model.getObjectByName("RebarRod_0");
          const rebar1Obj = model.getObjectByName("RebarRod_1");

          // A. Right Citadel
          if (monolithObj) rightCitadel.add(monolithObj.clone());
          if (innerCoreObj) rightCitadel.add(innerCoreObj.clone());

          // B. Left Monolith Spire
          if (monolithObj) {
            const leftSpire = monolithObj.clone();
            leftSpire.scale.set(0.9, 0.9, 0.9);
            leftMonolith.add(leftSpire);
          }
          if (innerCoreObj) {
            const leftCore = innerCoreObj.clone();
            leftCore.scale.set(0.9, 0.9, 0.9);
            leftMonolith.add(leftCore);
          }

          // C. Orbiting Shards
          for (let i = 0; i < 12; i++) {
            const shard = model.getObjectByName(`OrbitalShard_${i}`);
            if (shard) {
              const shardClone = shard.clone();
              shardClone.scale.set(1.65, 1.65, 1.65);
              shardsGroup.add(shardClone);
            }
          }

          // D. Hazard Pylons with Procedural Caution Chevron Rings & Beacon Lights
          if (hazardPylonObj) {
            const chevronMat = new THREE.MeshStandardMaterial({
              color: 0xff3b30,
              roughness: 0.25,
              metalness: 0.5,
              emissive: new THREE.Color(0xff2200),
              emissiveIntensity: 3.8,
            });
            const beaconMat = new THREE.MeshPhysicalMaterial({
              color: 0xff3b30,
              emissive: new THREE.Color(0xff3b30),
              emissiveIntensity: 6.0,
              transmission: 0.7,
              thickness: 1.5,
              roughness: 0.1,
            });

            // Left Hazard Pylon
            const pylonGroupL = new THREE.Group();
            const pylonL = hazardPylonObj.clone();
            pylonL.name = "Pylon_Left";
            pylonL.scale.set(1.65, 1.65, 1.65);
            pylonGroupL.add(pylonL);

            // Procedural Chevron Ring
            const chevronGeo = new THREE.CylinderGeometry(55, 60, 40, 8);
            const chevronL = new THREE.Mesh(chevronGeo, chevronMat);
            chevronL.position.set(0, 140, 0);
            pylonGroupL.add(chevronL);

            // Emergency Warning Beacon
            const beaconGeo = new THREE.SphereGeometry(22, 16, 12);
            const beaconL = new THREE.Mesh(beaconGeo, beaconMat);
            beaconL.name = "Beacon_L";
            beaconL.position.set(0, 360, 0);
            pylonGroupL.add(beaconL);

            pylonGroupL.position.set(-745, 20, -180);
            pylonGroupL.rotation.y = 0.35;
            pylonGroupL.rotation.z = 0.08;
            hazardPylonsGroup.add(pylonGroupL);

            // Right Hazard Pylon
            const pylonGroupR = new THREE.Group();
            const pylonR = hazardPylonObj.clone();
            pylonR.name = "Pylon_Right";
            pylonR.scale.set(1.65, 1.65, 1.65);
            pylonGroupR.add(pylonR);

            const chevronR = new THREE.Mesh(chevronGeo, chevronMat);
            chevronR.position.set(0, 140, 0);
            pylonGroupR.add(chevronR);

            const beaconR = new THREE.Mesh(beaconGeo, beaconMat);
            beaconR.name = "Beacon_R";
            beaconR.position.set(0, 360, 0);
            pylonGroupR.add(beaconR);

            pylonGroupR.position.set(745, 20, -180);
            pylonGroupR.rotation.y = -0.35;
            pylonGroupR.rotation.z = -0.08;
            hazardPylonsGroup.add(pylonGroupR);
          }

          // E. Tumbling Yero Sheets
          for (let i = 0; i < 6; i++) {
            const yero = model.getObjectByName(`TumblingYero_${i}`);
            if (yero) {
              const yeroClone = yero.clone();
              yeroClone.scale.set(2.5, 2.5, 2.5);
              yeroSheetsGroup.add(yeroClone);
            }
          }

          // F. Memory Polaroids & Mooring Cables
          if (memoryPolaroidObj) {
            const polL = memoryPolaroidObj.clone();
            polL.name = "Polaroid_Left";
            polL.position.set(-600, -40, -140);
            polL.scale.set(2.1, 2.1, 2.1);
            memoryGroup.add(polL);

            const polR = memoryPolaroidObj.clone();
            polR.name = "Polaroid_Right";
            polR.position.set(620, 60, -160);
            polR.scale.set(1.9, 1.9, 1.9);
            memoryGroup.add(polR);
          }
          if (mooringRopeObj) {
            const ropeL = mooringRopeObj.clone();
            ropeL.position.set(-660, 160, -130);
            ropeL.scale.set(1.6, 1.6, 1.6);
            memoryGroup.add(ropeL);

            const ropeR = mooringRopeObj.clone();
            ropeR.position.set(660, 160, -130);
            ropeR.rotation.y = Math.PI;
            ropeR.scale.set(1.6, 1.6, 1.6);
            memoryGroup.add(ropeR);
          }

          // G. Demolition Concrete Slabs, Hydraulic Pistons & Glowing Rebars
          const pistonMat = new THREE.MeshPhysicalMaterial({
            color: 0xe2e8f0,
            metalness: 0.95,
            roughness: 0.08,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          });

          if (concreteObj) {
            const concL = concreteObj.clone();
            concL.position.set(-650, 320, -160);
            concL.scale.set(2.3, 2.3, 2.3);
            demolitionGroup.add(concL);

            const concR = concreteObj.clone();
            concR.position.set(650, 320, -160);
            concR.scale.set(2.3, 2.3, 2.3);
            demolitionGroup.add(concR);

            const concBase = concreteObj.clone();
            concBase.position.set(0, 440, -220);
            concBase.scale.set(3.6, 1.25, 1.85);
            demolitionGroup.add(concBase);

            // Chrome Hydraulic Pistons supporting the foundation slabs
            const pistonGeo = new THREE.CylinderGeometry(14, 14, 160, 16);
            const pistonL = new THREE.Mesh(pistonGeo, pistonMat);
            pistonL.position.set(-650, 420, -160);
            demolitionGroup.add(pistonL);

            const pistonR = new THREE.Mesh(pistonGeo, pistonMat);
            pistonR.position.set(650, 420, -160);
            demolitionGroup.add(pistonR);
          }
          if (rebar0Obj) {
            const reb0L = rebar0Obj.clone();
            reb0L.position.set(-630, 340, -150);
            reb0L.scale.set(2.1, 2.1, 2.1);
            demolitionGroup.add(reb0L);

            const reb0C = rebar0Obj.clone();
            reb0C.position.set(0, 420, -200);
            reb0C.rotation.z = Math.PI * 0.5;
            reb0C.scale.set(2.3, 2.3, 2.3);
            demolitionGroup.add(reb0C);
          }
          if (rebar1Obj) {
            const reb1R = rebar1Obj.clone();
            reb1R.position.set(630, 340, -150);
            reb1R.scale.set(2.1, 2.1, 2.1);
            demolitionGroup.add(reb1R);
          }

          // H. Apex Crystal Spire Crown
          if (crystalObj) {
            const crystalCrown = crystalObj.clone();
            crystalCrown.name = "BridgeCrystalCrown";
            crystalCrown.position.set(0, 240, 0);
            crystalCrown.scale.set(2.1, 3.2, 2.1);
            bridgeSpireGroup.add(crystalCrown);
            rightCitadel.add(bridgeSpireGroup);
          }

          gltfLoaded = true;
          checkAllLoaded();
        },
        (err: unknown) => {
          console.error("GLTF Parse Error:", err);
          gltfLoaded = true;
          checkAllLoaded();
        }
      );
    } catch (e) {
      console.error("GLTF setup exception:", e);
      gltfLoaded = true;
      checkAllLoaded();
    }

    contextRef.current = {
      renderer,
      scene,
      threeCamera,
      skyDomeMesh,
      skyDomeShaderMaterial,
      textures: loadedTextures,
      rightCitadel,
      leftMonolith,
      cycloneRings,
      shardsGroup,
      hazardPylonsGroup,
      rooftopHorizonGroup,
      yeroSheetsGroup,
      memoryGroup,
      demolitionGroup,
      bridgeSpireGroup,
      skyTrussGroup,
      debrisInstancedMesh,
      debrisVelocities,
      celestialParticles,
      celestialPositions,
      hemiLight,
      keyLight,
      rimLight,
      kickLight,
      pointLight,
      accentLight,
    };

    return () => {
      renderer.dispose();
    };
  }, [width, height, safeContinueRender]);

  // Per-Frame Dynamic Animation Loop (Hybrid Deterministic Frame Clock)
  useLayoutEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const {
      renderer,
      scene,
      threeCamera,
      skyDomeMesh,
      skyDomeShaderMaterial,
      textures,
      rightCitadel,
      leftMonolith,
      cycloneRings,
      shardsGroup,
      hazardPylonsGroup,
      rooftopHorizonGroup,
      yeroSheetsGroup,
      memoryGroup,
      demolitionGroup,
      bridgeSpireGroup,
      skyTrussGroup,
      debrisInstancedMesh,
      debrisVelocities,
      celestialParticles,
      celestialPositions,
      hemiLight,
      keyLight,
      rimLight,
      kickLight,
      pointLight,
      accentLight,
    } = ctx;

    const currentTime = frame / 30;

    // 1. CAMERA PARALLAX & COUPLING
    const yawAngle = (-camera.ry * Math.PI) / 180;
    const pitchAngle = (-camera.rx * Math.PI) / 180;
    const rollAngle = (-camera.rz * Math.PI) / 180;

    threeCamera.rotation.y = yawAngle * 0.14;
    threeCamera.rotation.x = pitchAngle * 0.14;
    threeCamera.rotation.z = rollAngle * 0.65;
    threeCamera.position.x = camera.x * 0.12;
    threeCamera.position.y = -camera.y * 0.12;

    // 2. SHADER UNIFORMS & CHROMATIC CONTEXT UPDATE
    let targetTexture = textures.hero;
    let domeOpacity = 0.98;
    let sectionIntensity = 1.0;

    switch (activeSection) {
      case "prechorus":
        targetTexture = textures.hazard || textures.hero;
        domeOpacity = 0.99;
        sectionIntensity = 1.35;
        break;
      case "chorus":
        targetTexture = textures.yero || textures.hero;
        domeOpacity = 1.0;
        sectionIntensity = 1.4;
        break;
      case "verse2":
        targetTexture = textures.memory || textures.hero;
        domeOpacity = 0.97;
        sectionIntensity = 1.1;
        break;
      case "chorus2":
        targetTexture = textures.demolition || textures.hero;
        domeOpacity = 1.0;
        sectionIntensity = 1.3;
        break;
      case "bridge":
        targetTexture = textures.bridge || textures.hero;
        domeOpacity = 0.99;
        sectionIntensity = 1.5;
        break;
      case "outro":
      case "verse1":
      case "intro":
      default:
        targetTexture = textures.hero;
        domeOpacity = 0.98;
        sectionIntensity = 1.0;
        break;
    }

    if (skyDomeShaderMaterial.uniforms.map.value !== targetTexture && targetTexture) {
      skyDomeShaderMaterial.uniforms.map.value = targetTexture;
    }
    skyDomeShaderMaterial.uniforms.time.value = currentTime;
    skyDomeShaderMaterial.uniforms.lightningSurge.value = isLightningActive ? 1.0 : 0.0;
    skyDomeShaderMaterial.uniforms.accentColor.value.set(accentColor);
    skyDomeShaderMaterial.uniforms.opacity.value = domeOpacity;
    skyDomeShaderMaterial.uniforms.sectionIntensity.value = sectionIntensity;

    skyDomeMesh.position.x = camera.x * 0.08;
    skyDomeMesh.position.y = -camera.y * 0.08;
    skyDomeMesh.rotation.y = yawAngle * 0.05;
    skyDomeMesh.rotation.z = rollAngle * 0.2;

    // 3. INSTANCED DEBRIS DYNAMICS (Deterministic)
    const dummy = new THREE.Object3D();
    for (let i = 0; i < INSTANCED_DEBRIS_COUNT; i++) {
      const vy = debrisVelocities[i * 4 + 1];
      const rotSpeed = debrisVelocities[i * 4 + 3];

      const side = i % 2 === 0 ? -1 : 1;
      const baseX = side * (520 + (i * 7) % 420);
      const baseY = ((frame * vy + i * 25) % 1200) - 600;
      const baseZ = -150 - ((i * 12) % 450);

      dummy.position.set(baseX + Math.sin(frame * 0.05 + i) * 30, baseY, baseZ);
      dummy.rotation.set(frame * rotSpeed, frame * rotSpeed * 1.2, i);
      const s = 0.72 + Math.sin(i * 1.7) * 0.28;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      debrisInstancedMesh.setMatrixAt(i, dummy.matrix);
    }
    debrisInstancedMesh.instanceMatrix.needsUpdate = true;

    // 4. CELESTIAL PLASMA PARTICLES (Bridge & Outro)
    const isAscension = activeSection === "bridge" || activeSection === "outro";
    celestialParticles.visible = isAscension;
    if (isAscension) {
      const posAttr = celestialParticles.geometry.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < CELESTIAL_PARTICLES_COUNT; p++) {
        // Particles drift upward with harmonic sine oscillation
        const originalY = celestialPositions[p * 3 + 1];
        const newY = ((originalY - frame * 1.6) % 1000) - 500;
        posAttr.setY(p, newY);
        const originalX = celestialPositions[p * 3 + 0];
        posAttr.setX(p, originalX + Math.sin(frame * 0.04 + p) * 20);
      }
      posAttr.needsUpdate = true;
      (celestialParticles.material as THREE.PointsMaterial).color.set(accentColor);
    }

    // 5. STORYBOARD SECTION VISIBILITY & MOTION
    const isIntroOrVerse1 = activeSection === "intro" || activeSection === "verse1";
    cycloneRings.visible = isIntroOrVerse1 || activeSection === "outro";
    shardsGroup.visible = isIntroOrVerse1 || activeSection === "outro";
    skyTrussGroup.visible = true; // Always visible in upper-third as unifying brutalist architecture

    cycloneRings.children.forEach((ring, idx) => {
      ring.rotation.z = frame * (0.006 + idx * 0.003) * (idx % 2 === 0 ? 1 : -1);
    });

    shardsGroup.children.forEach((shard, idx) => {
      const angle = frame * 0.022 + idx * ((Math.PI * 2) / 12);
      const radiusX = 640 + Math.sin(idx * 1.3) * 140;
      const radiusZ = 280 + Math.cos(idx * 1.3) * 100;
      shard.position.x = Math.cos(angle) * radiusX;
      shard.position.y = Math.sin(angle * 2.2) * 200 + (idx * 18 - 100);
      shard.position.z = Math.sin(angle) * radiusZ - 280;
      shard.rotation.x = frame * 0.035 + idx;
      shard.rotation.y = frame * 0.025 + idx;
    });

    // Pre-Chorus Hazard Strobe & Warning Beacons
    const isPrechorus = activeSection === "prechorus";
    hazardPylonsGroup.visible = isPrechorus;
    if (isPrechorus) {
      const strobe = Math.sin(frame * 0.45) > 0.1 ? 1.0 : 0.35;
      hazardPylonsGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.emissive) {
            mat.emissiveIntensity = 3.5 * strobe + (isLightningActive ? 4.5 : 0);
          }
        }
      });
    }

    // Chorus 1 Tumbling Yero Sheets & Rooftop Horizon
    const isChorus1 = activeSection === "chorus";
    rooftopHorizonGroup.visible = isChorus1;
    yeroSheetsGroup.visible = isChorus1;
    if (isChorus1) {
      yeroSheetsGroup.children.forEach((sheet, idx) => {
        const flutter = Math.sin(frame * 0.4 + idx * 2.0) * 0.45;
        const driftX = Math.sin(frame * 0.09 + idx * 1.7) * 90;
        const driftY = Math.cos(frame * 0.11 + idx * 1.3) * 70;
        const side = idx % 2 === 0 ? -1 : 1;
        sheet.position.x = side * 640 + driftX;
        sheet.position.y = -60 + idx * 55 + driftY;
        sheet.position.z = -140 - idx * 60;
        sheet.rotation.x = frame * 0.07 + flutter;
        sheet.rotation.y = frame * 0.09 + idx;
        sheet.rotation.z = Math.sin(frame * 0.06 + idx) * 0.7;
      });
    }

    // Verse 2 Memory Polaroids & Ropes
    const isVerse2 = activeSection === "verse2";
    memoryGroup.visible = isVerse2;
    if (isVerse2) {
      memoryGroup.children.forEach((child, idx) => {
        const sway = Math.sin(frame * 0.055 + idx * 2.2) * 0.18;
        child.rotation.z = sway;
        child.rotation.y = sway * 0.6;
        child.position.y += Math.sin(frame * 0.05 + idx) * 0.6;
      });
    }

    // Chorus 2 Demolition & Hydraulic Pistons
    const isChorus2 = activeSection === "chorus2";
    demolitionGroup.visible = isChorus2;
    if (isChorus2) {
      const tremorY = Math.sin(frame * 0.85) * 8 + Math.cos(frame * 1.5) * 5;
      const tremorX = Math.cos(frame * 0.75) * 4;
      demolitionGroup.position.y = tremorY;
      demolitionGroup.position.x = tremorX;
      demolitionGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (
            mat.name.toLowerCase().includes("rebar") ||
            child.name.toLowerCase().includes("rebar")
          ) {
            mat.emissiveIntensity =
              3.6 + Math.sin(frame * 0.25) * 1.6 + (isLightningActive ? 4.5 : 0);
          }
        }
      });
    }

    // Bridge Spire Climax
    const isBridge = activeSection === "bridge";
    bridgeSpireGroup.visible = isBridge;
    if (isBridge) {
      const spirePulse = 4.8 + Math.sin(frame * 0.35) * 2.4 + (isLightningActive ? 5.5 : 0);
      bridgeSpireGroup.position.y = 240 + Math.sin(frame * 0.08) * 35;
      bridgeSpireGroup.rotation.y = -frame * 0.025;
      bridgeSpireGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.emissive.set(accentColor);
          mat.emissiveIntensity = spirePulse;
        }
      });
    }

    // 6. FLANK CITADEL IDLE DRIFT & ROTATION
    rightCitadel.rotation.y = -0.35 + Math.sin(frame * 0.007) * 0.07;
    rightCitadel.position.x = 745 + Math.sin(frame * 0.009) * 16;
    leftMonolith.rotation.y = 0.35 + Math.cos(frame * 0.007) * 0.07;
    leftMonolith.position.x = -780 - Math.cos(frame * 0.009) * 16;

    // 7. DYNAMIC STUDIO LIGHTING SURGE
    if (isLightningActive) {
      hemiLight.intensity = 6.8;
      keyLight.intensity = 10.0;
      rimLight.intensity = 8.0;
      kickLight.intensity = 7.5;
      kickLight.color.set(accentColor);
      pointLight.intensity = 11.0;
      pointLight.color.set(accentColor);
      accentLight.intensity = 10.0;
      accentLight.color.set(accentColor);
    } else {
      hemiLight.intensity = 4.2;
      keyLight.intensity = 5.4;
      rimLight.intensity = 4.8;
      kickLight.intensity = 4.2;
      kickLight.color.set(accentColor);
      pointLight.intensity = 4.0;
      pointLight.color.setHex(0x00f0ff);
      accentLight.intensity = 5.2;
      accentLight.color.set(accentColor);
    }

    // 8. MATERIAL EMISSIVE SYNCHRONIZATION
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (!mat.emissive) return;

        const name = (child.name || "").toLowerCase();
        if (name.includes("plasmacore")) {
          mat.emissiveIntensity = isLightningActive ? 8.5 : 4.8;
          mat.emissive.set(isLightningActive ? accentColor : "#00f5ff");
        } else if (name.includes("shard")) {
          mat.emissiveIntensity = isLightningActive ? 7.5 : 4.2;
        }
      }
    });

    renderer.render(scene, threeCamera);

    if (isLoaded) {
      safeContinueRender();
    }
  }, [
    frame,
    camera,
    activeSection,
    accentColor,
    isLightningActive,
    isLoaded,
    safeContinueRender,
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
