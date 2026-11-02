# Visual Direction: Ako Ang Bagyo (3D Storm World & Kinetic Typography)

---

## 1. Executive Summary & Creative Vision

**"Ako Ang Bagyo"** (English: *"I Am The Storm"*) is a high-octane, emotionally cathartic kinetic typography visual piece that chronicles the psychological metamorphosis of grief, betrayal, and heartbreak into sovereign, mythic elemental power. 

Rather than framing the storm as an external disaster or a gloomy downpour, the creative vision manifests the protagonist **as the storm itself**: an unstoppable, incandescent celestial tempest tearing through emotional debris, shattering fortified walls, ripping off roofs, and illuminating an obsidian void with brilliant electric cyan plasma and amber lightning conduits.

```
+-----------------------------------------------------------------------------+
|                                VISUAL ESSENCE                               |
|                                                                             |
|      EMOTIONAL VULNERABILITY    =====>    SOVEREIGN CELESTIAL DEFIANCE      |
|  (Tears, Dizzy Orbit, Hidden Photos)     (Ripped Yero, Shattered Concrete)  |
|                                                                             |
|                 INCANDESCENT STORM MONOLITHS & PLASMA GRIDS                 |
|               ZERO UNLIT SURFACES | 100% TYPOGRAPHY CORRIDOR                |
+-----------------------------------------------------------------------------+
```

The visual world fuses **authentic Philippine storm signifiers**—corrugated galvanized iron sheets (*yero*), shattered concrete walls with protruding rust-red rebar, and torrential monsoons—with **futuristic brutalist megaliths** and **celestial plasma conduits**.

---

## 2. Narrative & Thematic Interpretation

The visual progression maps directly across the eight musical and narrative movements of the song:

```
[INTRO]                   [VERSE 1]                  [PRE-CHORUS]                [CHORUS 1]
Cold Awakening             Dizzy Orbit                Hazard Tension              Storm Detonation
Misty Fog & Spires   --->  Floating Shards     --->  Crimson Alarm        --->   Yero Roof Ripping
Camera: Z: 800 -> 0        Orbit Radius: 0.35         Red Warning (#ff3b30)       Cyan Flash (#00f0ff)

[VERSE 2]                 [CHORUS 2]                 [BRIDGE]                    [OUTRO]
Intimate Betrayal          Structural Ruin            Violet Dissolution          Ascension
Polaroid Unfolding   --->  Demolition Piston   --->  Apex Spire Telescopes --->  Supercell Core
Photo Frame Exposed        Rebar & Concrete Walls     Twilight Violet (#c084fc)   Infinite Horizon
```

### Thematic Anchors from Lyrics

1. **"Pinaikutan mo 'ko sumunod mundo ko nahilo"** (*Verse 1: 00:26 – 00:50*):
   - *Translation*: "You orbit around me, and the next, my world got dizzy."
   - *Visual Translation*: The central world begins in a state of gravitational instability. Crystalline orbital shards levitate around the central monolith spire, slowly rotating in elliptical orbits that expand and warp as the emotional weight deepens (*"Bumigat ang kalungkutan"*).

2. **"Matakot ka na / Ako, ako ang bagyo"** (*Pre-Chorus: 00:50 – 01:05*):
   - *Translation*: "Be terrified now / I am, I am the storm."
   - *Visual Translation*: The atmosphere shifts abruptly from melancholy sky blue (`#38bdf8`) to vibrant hazard crimson (`#ff3b30`). Energy conduits within the megalith crackle with high-voltage charge, telegraphing an imminent release of sovereign wrath.

3. **"Tatangayin ko bawat yero"** (*Chorus 1: 01:05 – 01:30*):
   - *Translation*: "I will rip every roof off of it."
   - *Visual Translation*: Evoking the iconic sight and deafening roar of Philippine typhoons tearing corrugated zinc roofs from structures, six curved galvanized metal sheets (*yero*) articulate outward from the citadel wings, tumbling violently through volumetric storm drafts with high specular metallic sheen.

4. **"Itinago na litrato, nagkunwaring 'di nakita"** (*Verse 2: 01:30 – 02:00*):
   - *Translation*: "Hidden photos, pretending that I didn't see."
   - *Visual Translation*: An articulated mechanical aperture extends a floating Polaroid memory frame from the monolith's left flank (`X = -4.7`, `Z = +3.4`). The frame glows with nostalgic, incandescent cyan light, encapsulating the painful memory before being subsumed by the storm.

5. **"Gigibain ko mga pader"** (*Chorus 2: 02:15 – 02:40*):
   - *Translation*: "I will wreck every wall off of it."
   - *Visual Translation*: The citadel's base undergoes tectonic demolition: massive concrete foundation blocks drop on pneumatic pistons, exposing glowing industrial rebar rods drenched in rust-orange luminescence (`#f97316`).

6. **"Sa isang iglap, kumukulo ang kulog sa 'king puso... Kahit matunaw pa ako"** (*Bridge & Climax: 02:40 – 03:30*):
   - *Translation*: "In just one small move, thunders roar in my heart... Even if I melt / Because I am the storm."
   - *Visual Translation*: The apex crystal spike telescopes upward into the tempest. Color temperatures shift into ethereal twilight violet (`#c084fc`). As the voice reaches its ultimate emotional peak, lightning conduits discharge at 8.0x emissive intensity, dissolving the physical boundaries between the citadel and the surrounding supercell.

---

## 3. Mood Board & Aesthetic Language

### Key Aesthetic Pillars

| Aesthetic Pillar | Creative Description | Material & Lighting Implementation |
|---|---|---|
| **Brutalist Celestial Spires** | Towering basalt and titanium obelisks piercing turbulent supercells. Angular, faceted geometry evoking sacred monolithic monuments. | Slate blue-grey basalt (`#2a3b5c`, roughness 0.28, metalness 0.22) with beveled chamfers catching sharp directional rim light. |
| **Living Plasma Conduits** | Glowing vertical circuitry channels and internal pulsating cores running through the stone geometry. | Hyper-emissive neon cyan (`#00f0ff` / `#00ffff`, emission 3.5x to 7.0x) with zero shadow falloff. |
| **Philippine Vernacular Debris** | Cultural artifacts of tropical storms: airborne corrugated iron (*yero*), exposed reinforced concrete rebars, and tumbling memory Polaroid fragments. | Brushed galvanized zinc (`#dce7f2`, metalness 0.35, roughness 0.25) and vivid rust orange-red rebar (`#f97316`, emission 0.6x). |
| **Volumetric Supercell Voids** | Multi-layered atmospheric cloud shelves with celestial god rays breaking through the eye of the storm. | Deep indigo/violet atmospheric gradient with `THREE.FogExp2(0x060c18, 0.0012)`. |
| **High-Voltage Lightning Conduits** | Multi-branching screen-space SVG lightning arcs synchronized to audio transients and lyric emphases. | Neon amber (`#fbbf24`), electric cyan (`#00f0ff`), and pure white core (`#ffffff`), accompanied by dynamic PointLight flashes (intensity 9.5x). |

---

## 4. Comprehensive Color Palette & Lighting Bible

### Core Chromatic System

The color palette is engineered to maintain high contrast, emotional resonance, and absolute legibility against white and cyan typography. **Under no circumstances should any surface render as unlit or pitch black (`#000000`).**

```
+-------------------------------------------------------------------------------------------------+
|                                    COLOR PALETTE SPECIFICATION                                  |
+-------------------+---------+-------------------+-----------------------------------------------+
| Swatch Name       | Hex     | RGB               | Narrative / Shader Application                |
+-------------------+---------+-------------------+-----------------------------------------------+
| Electric Cyan     | #00f0ff | rgb(0, 240, 255)  | Core plasma, lightning channels, Chorus pulse |
| Pure Cyan Plasma  | #00ffff | rgb(0, 255, 255)  | Inner plasma core, crystal emission highlight |
| Deep Sky Blue     | #38bdf8 | rgb(56, 189, 248) | Verse 1 / 2 accent, crystal body, raindrops   |
| Stormy Indigo     | #0c102b | rgb(12, 16, 43)   | Primary background atmosphere, night void     |
| Midnight Abyss    | #060c18 | rgb(6, 12, 24)    | Atmospheric fog density base, deep space      |
| Twilight Violet   | #8b5cf6 | rgb(139, 92, 246) | Bridge atmosphere, emotional transformation   |
| Ethereal Lavender | #c084fc | rgb(192, 132, 252)| Bridge typography, apex needle glow           |
| Hazard Crimson    | #ff3b30 | rgb(255, 59, 48)  | Pre-Chorus alarm, impending storm tension     |
| Amber Lightning   | #fbbf24 | rgb(251, 191, 36) | Lightning discharge branches, solar god rays  |
| Solar Gold Core   | #f59e0b | rgb(245, 158, 11) | High-voltage arc grounding contact points     |
| Galvanized Silver | #dce7f2 | rgb(220, 231, 242)| Corrugated yero roofs, metallic specular edge |
| Basalt Slate      | #2a3b5c | rgb(42, 59, 92)   | Monolith exterior stone facet panels          |
| Weathered Concrete| #b2bfce | rgb(178, 191, 206)| Shattered foundation blocks, urban masonry    |
| Rust Orange Rebar | #f97316 | rgb(249, 115, 22) | Exposed industrial rebars, structural tear    |
| Pure Core White   | #ffffff | rgb(255, 255, 255)| Direct lightning arc core, polaroid frame     |
+-------------------+---------+-------------------+-----------------------------------------------+
```

### The "Zero Unlit / Zero Black" Rule

To prevent visual dead zones and maintain production-grade broadcast vibrancy:
1. **Hemisphere Fill Light**: A `THREE.HemisphereLight(0xdbeafe, 0x0f172a, 3.6)` provides dual-tone sky/ground ambient illumination across all 3D geometry.
2. **Key & Rim Illumination**: A pure white key light (`intensity: 4.4` at `[400, 500, 400]`) pairs with an electric cyan rim light (`intensity: 3.6` at `[-500, -200, 200]`) to ensure every polygonal edge catches sharp specular highlights.
3. **Minimum Material Emissive Floor**:
   - Monolith Stone: `emissive: #00f0ff`, `emissiveIntensity: 0.5`
   - Concrete Blocks: `emissive: #222d3d`, `emissiveIntensity: 0.2`
   - Galvanized Yero: `emissive: #223a54`, `emissiveIntensity: 0.25`
   - Exposed Rebar: `emissive: #c2410c`, `emissiveIntensity: 0.6`
   - Plasma & Crystals: `emissive: #00f5ff`, `emissiveIntensity: 3.0 to 7.0`
4. **Dynamic Lightning Surge**: When `isLightningActive` is triggered by `lyricsData.ts`, key light surges to `8.5`, point light surges to `9.5`, and crystal emission leaps to `8.0x`.

---

## 5. 2D Concept to 3D Mesh Translation Matrix

Every aesthetic element established in the 2D Gemini concept images translates directly into procedural Blender geometry and runtime Three.js nodes:

| # | 2D Concept Element | Blender 3D Mesh Target | Geometry Construction | Material & Shader Specification | Remotion Anchoring & Motion Hook |
|---|---|---|---|---|---|
| **1** | **Towering Monolith Obelisk** | `StormMonolith_Tower` | Tapered 8-sided faceted obelisk with beveled vertical chamfers and conduit grooves | Slate Blue Basalt (`#2a3b5c`), metalness 0.22, roughness 0.28, emissive `#00f0ff` @ 0.5x | Anchor: `X: +740px to +750px`, `Y: +110px`, `Z: -200px` (shifted rightward to protect Tier 1 corridor under full wing articulation). Continuous idle yaw (`ry = frame * 0.008`). |
| **2** | **Pulsating Conduit Channels** | `InnerPlasmaCore` | Nested inner core cylinder with longitudinal energy vents | Hyper-Emissive Cyan Plasma (`#00ffff`), roughness 0.05, emissive `#00f5ff` @ 3.5x to 7.0x | Synchronized to `isLightningActive` and `accentColor`; surges to 7.0x on strikes. |
| **3** | **Orbiting Crystalline Shards** | `OrbitalShard_0` to `OrbitalShard_11` | 12–16 bipyramidal faceted quartz crystals orbiting the core | Luminous Cyan Quartz (`#00ffff`), transparent opacity 0.95, emissive `#00f5ff` @ 3.5x | Orbit radius expands from `0.35` (Verse 1) to `1.0` (Chorus) at `Radius: 2.4`, `Z: -200px`. |
| **4** | **Airborne "Yero" Sheets** | `TumblingYero_0` to `TumblingYero_5` | 6 corrugated curved rectangular quads with periodic wave displacement | Brushed Galvanized Zinc (`#dce7f2`), metalness 0.35, roughness 0.25, DoubleSide | Articulates outward laterally on Chorus 1 ("Tatangayin ko bawat yero", Frames 1650–1850). |
| **5** | **Memory Polaroid Frame** | `MemoryPolaroid` | Beveled card frame with square photo inset texture | Matte White Border (`#ffffff`) + Luminous Cyan Storm Inset (`#38bdf8`), emissive 0.4x | Swings forward on articulated boom strut during Verse 2 ("Itinago na litrato", Frames 2650–2850). |
| **6** | **Demolition Concrete & Rebar** | `ConcreteBlock` & `RebarRod_0..1` | Fractured concrete cuboids with protruding twisted cylindrical rods | Weathered Concrete (`#b2bfce`, emissive 0.2x) + Rust Orange Rebar (`#f97316`, emissive 0.6x) | Base pistons extend downward by `120px` during Chorus 2 ("Gigibain ko mga pader", Frames 3650–3850). |
| **7** | **Apex Thunder Spire Crown** | `CrystalSpike` | Faceted crystalline needle acting as lightning conductor | Translucent Cyan Glass (`#38bdf8`), roughness 0.1, emissive `#00f5ff` @ 3.0x to 8.0x | Telescopes upward by `85px` during Bridge Climax (Frames 5450–5750); peak strike attractor. |
| **8** | **Volumetric Skybox Atmosphere** | Background Plane / Fog | Dual-layer radial gradient backdrop and exponential fog | `THREE.FogExp2(0x060c18, 0.0012)` + CSS radial gradient | Deep Horizon (`Z: -1000` to `-5000`); smooth color transitions matching section accents. |
| **9** | **Screen-Space Lightning Arcs** | `<Lightning />` SVG component | Procedurally generated multi-branching SVG vector paths | SVG glow filter (`#00f0ff`, `#fbbf24`), stroke width 2.5px to 6px | Foreground (`Z: 0`), triggered on lyric lines with `hasLightning: true`. |

---

## 6. Typography Corridor Protection Architecture

### Spatial Layout & The Two-Tier Corridor Model

In a kinetic typography video, **readability and emotional catharsis must coexist**. To balance massive, expressive kinetic typography against a dynamic 3D storm environment, the composition is governed by a **Two-Tier Corridor Model**:

1. **Tier 1: Primary Focal Reading Core (`1000px × 620px`)** — The human visual fixation center where word onsets, vocal scale springs, and emphasis highlights are registered (`[-500px, +500px]` horizontal, `[-310px, +310px]` vertical). This zone is a **strict zero-geometry exclusion zone** for solid 3D midground meshes across all animation and camera states.
2. **Tier 2: Cinematic Lyric Container Envelope (`1600px × 700px`)** — The outer structural envelope accommodating wide multi-word layouts, diagonal tilts, split-flank convergence, cross-tilt perspective, translation subtitle ribbons (`maxWidth: 1300px`), and monumental chorus titles (`maxWidth: 1600px`) across `[-800px, +800px]` horizontal and `[-350px, +350px]` vertical. Lateral 3D elements may inhabit the background margins of Tier 2 under strict contrast and fog attenuation.

```
+---------------------------------------------------------------------------------------------------+
| 1920 x 1080 RENDER CANVAS                                                                         |
|                                                                                                   |
|  [ LEFT MARGIN ]     [ TIER 2: CINEMATIC CONTAINER ENVELOPE (1600px x 700px) ]    [ RIGHT FLANK ] |
|  X <= -800px         X: -800px to +800px | Y: -350px to +350px                    X >= +720px     |
|                      +-----------------------------------------------------+      +------------+  |
|                      |  [ TIER 1: PRIMARY FOCAL CORE (1000px x 620px) ]    |      | 3D CITADEL |  |
|                      |  X: -500px to +500px | Y: -310px to +310px          |      | MONOLITH   |  |
|                      |  (STRICT ZERO SOLID 3D GEOMETRY ZONE)               |      | X = +740px |  |
|                      |                                                     |      | Y = +110px |  |
|                      |             "TATANGAYIN KO BAWAT YERO"              |      | Z = -200px |  |
|                      |               (High-Speed Word Pops)                |      |            |  |
|                      |                                                     |      | (Articulated| |
|                      |         "I will rip every roof off of it"           |      |  wings stay|  |
|                      |            (Translation Subtitle Ribbon)            |      |  clear of  |  |
|                      |                                                     |      |  Tier 1)   |  |
|                      +-----------------------------------------------------+      +------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Two-Tier Corridor Specification Matrix

| Parameter | Tier 1: Primary Focal Reading Core | Tier 2: Cinematic Container Envelope | Lateral Flanks (3D Stage) |
|---|---|---|---|
| **Width × Height** | `1000px × 620px` | `1600px × 700px` | Outer screen margins (`> 1600px` canvas) |
| **Screen X Bounds** | `[-500px, +500px]` | `[-800px, +800px]` | `X <= -800px` or `X >= +720px` |
| **Screen Y Bounds** | `[-310px, +310px]` | `[-350px, +350px]` | Full vertical height (`[-540px, +540px]`) |
| **Typography Role** | Vocal onset springs (`scale: 1.08x`), word emphasis badges, compact vertical-stack columns | Multi-word horizontal lines (`1450px`), diagonal tilts (`1450px`, ±10°), split convergence (`1500px`), perspective cross-tilts (`1500px`), monumental titles (`1600px`), translation subtitles (`1300px`) | Non-typographic zone; reserved for cinematic peripheral framing |
| **3D Geometry Policy** | **Strict Zero Midground Geometry**: No solid mesh (`Z > -600px`) may enter under any frame, camera rotation, or articulation state. | **Layered Background Zone**: Midground 3D assets permitted in outer lateral zones (`500px < \|X\| <= 800px`), with typography rendering strictly on top (`Z = 0`, full opacity). | **Primary Solid 3D Anchor**: Monolith citadel base anchored at `X = +740px to +750px`, Yero wings and polaroid swing clear of Tier 1. |
| **Contrast Enforcement** | "Eye of the Storm" negative space void; exponential fog (`0.0012`) guarantees minimum **4.5:1 WCAG contrast ratio**. | Dual-stage text shadow (`0 0 35px ${accentColor}`, `0 0 70px ${accentColor}80`) and active badge background pills isolate glyphs from background detail. | Specular rim lights (`0x00f0ff` @ 3.6x) illuminate polygonal facets against deep space. |

### Container Dimensions by Kinetic Mode in `KineticAnimators.tsx`

| Mode | Target Layout & Orientation | Container `maxWidth` | Screen Relative X Bounds | Typographic Scale (Montserrat 900) |
|---|---|---|---|---|
| `vertical-stack` | Single-column poster layout | Natural word width (`~400px`) | `[-225px, +225px]` | 74px – 96px |
| `horizontal` | Standard clean display banner | `1450px` | `[-725px, +725px]` | 74px – 92px |
| `diagonal-up` | Ascending velocity tilt (-10° / -4° skew) | `1450px` | `[-725px, +725px]` | 74px – 92px |
| `diagonal-down` | Descending cascade tilt (+10° / +4° skew) | `1450px` | `[-725px, +725px]` | 74px – 92px |
| `split-flank` | Dual opposing converging word groups | `1500px` | `[-750px, +750px]` (dynamic ±80px spring) | 74px – 92px |
| `cross-tilt` | 3D perspective angular tilt (rotateY ±16°) | `1500px` | `[-750px, +750px]` | 74px – 92px |
| `monolith-center` | Monumental climax chorus typography | `1600px` | `[-800px, +800px]` | 90px – 120px |
| *Translation Subtitle* | Subtitle ribbon (active across all 7 modes) | `1300px` | `[-650px, +650px]` | 22px (Oswald 600) |

### The Four Non-Negotiable Clearance & Legibility Rules

1. **Rule 1: Two-Tier Lateral Flanking Constraint (Screen X)**:
   - All major solid 3D geometry in the midground (`Z > -600px`) must reside strictly outside the Tier 1 core (`|X| >= 500px`).
   - The primary 3D monolith citadel is permanently anchored at **`X = +740px to +750px`**, `Y = +110px`, `Z = -200px`.
   - Even when articulated sub-assemblies fully deploy (left Yero wings extending outward and Polaroid aperture extending at scale 38–43.7), and under dynamic camera yaw (`threeCamera.rotation.y`), the projected screen position of the leftmost vertex remains strictly at **`RelX > +500px`** (Screen X > 1460px), guaranteeing 100% geometric clearance of the Tier 1 focal core across all 8,325 frames.

2. **Rule 2: Z-Depth Separation & DOM Layering**:
   - The kinetic typography plane resides in 2D DOM space at **`Z = 0`** with `position: absolute` and full `opacity: 1`. It renders directly over the WebGL background canvas, eliminating any physical depth occlusion.
   - The 3D citadel resides in Three.js world space at **`Z = -200px`**.
   - Any secondary ambient particles or atmospheric dust crossing the central corridor must reside at **`Z <= -800px`**. At this depth, `THREE.FogExp2(0x060c18, 0.0012)` reduces geometric contrast by over 65%, rendering it as soft, ethereal ambient depth.

3. **Rule 3: Luminance Contrast & Text-Shadow Halo Isolation**:
   - The background immediately behind the central Tier 1 core is composed as the **"Eye of the Storm"**—a vast, open, low-frequency atmospheric gradient of deep stormy indigo (`#0c102b`) to midnight abyss (`#060c18`).
   - For wide Tier 2 lyric lines extending into lateral margins (`500px < |X| <= 800px`), legibility is enforced through multi-stage CSS glowing halos (`textShadow: 0 0 35px ${accentColor}, 0 0 70px ${accentColor}80`) and active badge background pills (`backgroundColor: accentColor`, `border: 2px solid ${accentColor}`). This guarantees a minimum **4.5:1 WCAG luminance contrast ratio** across the entire 1600px container width.

4. **Rule 4: Lightning Arc Grounding Exclusion**:
   - Screen-space SVG lightning arcs must originate from atmospheric nodes in the upper periphery and ground either into the lateral monolith spires (`X >= +720px`) or off-screen.
   - Lightning arcs must never terminate or cross through active word bounding boxes.

### Triad Fix Strategy for 3D Geometry Clearance (Milestones 2 & 3 Implementation)

To guarantee mathematical zero-penetration into Tier 1 (`minRelX > +500px`) under all dynamic camera animations and mesh articulations, the Three.js runtime implementation in `ThreeBackgroundMonolith.tsx` adheres to the **Triad Fix Strategy**:

1. **World Anchor Shift (`X = +740px to +750px`)**:
   - Shift the base anchor of `artifactCitadel` from `+460px` to `+740px to +750px`, `Y = +110px`, `Z = -200px` (idle hover drift oscillation: `X = 750 + Math.sin(frame * 0.006) * 20`).
   - This baseline shift establishes `minRelX = +550.2px` under static camera projection, clearing Tier 1 by 50px before articulation.

2. **Asymmetric Articulation Constraints**:
   - **Left Yero Wings (`yeroWingsLeft`)**: Clamped to a maximum span of `2.4` units (`currentWingSpanL = 1.2 + yeroDeploy * 1.2`), with sheet step offsets clamped to `stepX = -sheetIdxInWing * 0.5` (max `-1.0` instead of `-2.2`). This limits total inward citadel-space extension from `-7.0` to `-3.4`.
   - **Right Yero Wings (`yeroWingsRight`)**: Retains full, dramatic deployment (`currentWingSpanR = 1.2 + yeroDeploy * 3.6`, max `4.8`, step `1.1`) into the open right flank, preserving full theatrical storm visual power.
   - **Polaroid Aperture (`polaroidAperture`)**: Inward extension clamped to `position.x = -1.2 - polaroidDeploy * 1.0` (max `-2.2`, down from `-4.7`), keeping the memory artifact prominent while preventing it from entering the reading core.

3. **Camera Yaw Parallax Decoupling (`gamma_ry = 0.12`)**:
   - In dynamic camera tracking, raw yaw rotation (`ry` up to `±30.48°`) previously caused perspective projection sweeps of up to `-377.5px` to the left.
   - Decouple and dampen yaw rotation from `0.70` to **`0.12`** (`threeCamera.rotation.y = (-camera.ry * Math.PI / 180) * 0.12`) and scale position parallax (`threeCamera.position.x = camera.x * 0.08`).
   - Combined Result: The minimum projected coordinate across all 8,325 frames is **`minRelX = +641.6px`** (static `+780.4px`), providing a **141.6px safety buffer** beyond Tier 1's boundary (`+500px`) and yielding a **0.0% penetration rate**.

---

## 7. Reference Assets in Workspace

The visual direction is anchored by two production-ready concept assets deployed directly in the project workspace:

1. **Hero Storm World Reference**:
   - Runtime Path: `my-video/public/assets/ako_ang_bagyo_storm_concept.jpg`
   - Documentation Copy: `docs/concept/ako_ang_bagyo_storm_concept.jpg`
   - File Size: `867.95 KB` (888,779 bytes)
   - Dimensions: `1376 x 768` (16:9 widescreen, 1.792 aspect ratio)
   - Visual Features: Flanking megaliths, central supercell eye, electric cyan plasma channels, deep indigo volumetric fog.

2. **Architectural & Material Detail Reference**:
   - Runtime Path: `my-video/public/assets/monolith_asset_detail.jpg`
   - Documentation Copy: `docs/concept/monolith_asset_detail.jpg`
   - File Size: `992.55 KB` (1,016,376 bytes)
   - Dimensions: `1376 x 768` (16:9 widescreen, 1.792 aspect ratio)
   - Visual Features: Tapered spire obelisk, exposed rebar framing, corrugated yero sheets, translucent crystal apex needle crown.
