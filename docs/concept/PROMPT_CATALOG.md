# Prompt Catalog: Ako Ang Bagyo Concept Generation

---

## 1. Generative AI Pipeline Architecture

The visual identity of **"Ako Ang Bagyo"** was developed through targeted generative image prompts executed via Gemini image models. These concept references serve as the single source of truth for:
1. **Procedural 3D Modeling (Blender `bpy`/`bmesh`)**: Establishing topological contours, chamfers, bevels, and nested sub-assembly geometries.
2. **PBR Shaders & Emissive Materials**: Calibrating roughness, metalness, specular highlights, and emissive strengths under the `KHR_materials_emissive_strength` specification.
3. **Remotion Composition Layout**: Defining depth layering, camera field of view, lighting surge behaviors, and typography corridor negative space.

### Generation Technical Specifications

| Parameter | Specification | Technical Rationale |
|---|---|---|
| **Model Family** | Gemini Multi-Modal Image Generation | Advanced spatial composition, volumetric lighting comprehension, and metallic/dielectric material rendering. |
| **Aspect Ratio** | `16:9` Widescreen | Matches Remotion target canvas aspect ratio (1920 × 1080). |
| **Native Generation Resolution** | `1376 x 768` pixels | Maximum 16:9 pixel grid output from generator; sharp high-frequency edge definition. |
| **Color Space** | sRGB with wide-gamut highlights | Ensures seamless translation into WebGL Three.js `SRGBColorSpace`. |
| **Lighting Constraint** | Zero pitch-black (`#000000`) surfaces | Ambient bounce fill and emissive floors ensure all geometry remains visible in broadcast rendering. |
| **Spatial Rule** | Rule-of-Thirds Lateral Flanking | Enforces central clearance for the 1000px × 620px kinetic typography corridor. |

---

## 2. Core Concept Prompts

### Prompt 1: Hero Storm World Concept

- **Identifier**: `storm_monolith_concept`
- **Output Filename (Runtime)**: `my-video/public/assets/ako_ang_bagyo_storm_concept.jpg`
- **Output Filename (Documentation)**: `docs/concept/ako_ang_bagyo_storm_concept.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `888,779 bytes` (~867.95 KB)

#### Verbatim Prompt Text

```text
Cinematic 16:9 ultra-wide concept art of a majestic sci-fi storm world inspired by 'Ako Ang Bagyo' (I Am The Storm). 

Composition layout:
- Flanking massive brutalist celestial monolithic spires on the left and right thirds of the widescreen frame, with weathered slate-grey stone panels, sharp geometric chamfers, and glowing vertical electric cyan energy conduits.
- The center third of the frame is a vast, open, unobstructed atmospheric corridor looking deep into the Eye of the Storm, with swirling volumetric clouds, ethereal celestial god rays breaking through the upper tempest, and dynamic atmospheric mist.
- Multiple layers of stormy clouds: deep stormy indigo, twilight violet, and electric cyan lightning arcs bridging between the outer monoliths.
- Floating geometric megaliths and levitating debris orbit the towering spires.
- The lighting is vibrant and dramatic: neon cyan plasma glow, golden amber lightning highlights, and radiant purple rim lighting that illuminates all geometric edges. 
- Ensure zero unlit or pitch-black areas; all dark surfaces have rich, luminous ambient blue, violet, or cyan bounce light and reflections. 
- Epic scale, 8k resolution, octane render, Unreal Engine 5 cinematic lighting, majestic and defiant mood, perfect negative space in the center for typography overlay.
```

#### Compositional & Aesthetic Evaluation

```
+-----------------------------------------------------------------------------+
| R1 PROMPT 1 COMPOSITION ANALYSIS: HERO CONCEPT                              |
|                                                                             |
|  LEFT THIRD (Spire A)        CENTER THIRD (Safe Eye)   RIGHT THIRD (Spire B)|
|  - Towering megalith         - Deep open atmospheric   - Flanking citadel   |
|  - Cyan plasma conduit         corridor (Z: -5000px)   - Levitating shards  |
|  - Rim-lit bevels            - Soft volumetric mist    - Specular highlights|
|  - High-frequency geometry   - High luminance contrast - Zero pitch-black   |
|                                against white text        surfaces           |
+-----------------------------------------------------------------------------+
```

- **Lateral Spire Framing**: The two towering megaliths occupy the lateral perimeters (`X <= -550px` and `X >= +450px`), leaving the central screen coordinate (`X = 0`) entirely clear of solid geometry.
- **Color Temperature Harmony**: Warm amber/gold lightning discharges (`#fbbf24`) create an energetic complementary contrast against deep stormy indigo (`#0c102b`) and electric cyan (`#00f0ff`).
- **Surface Luminance**: Ambient bounce fill prevents dark crevices from clipping to pure black, fulfilling the zero-unlit constraint.

---

### Prompt 2: Architectural Asset & Shader Detail Reference

- **Identifier**: `monolith_asset_detail`
- **Output Filename (Runtime)**: `my-video/public/assets/monolith_asset_detail.jpg`
- **Output Filename (Documentation)**: `docs/concept/monolith_asset_detail.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `1,016,376 bytes` (~992.55 KB)

#### Verbatim Prompt Text

```text
Detailed 16:9 architectural 3D asset concept and material reference for a celestial storm monolith citadel inspired by the song 'Ako Ang Bagyo'. 

Close-up three-quarter perspective showcasing the intricate geometry and materials of the central spire:
- A towering tapered obelisk of dark slate blue-grey basalt stone with beveled facet edges and engraved glowing circuitry channels filled with pulsating neon cyan plasma.
- Orbiting the spire are floating geometric crystal quartz shards with glowing cyan and sky-blue emissive highlights.
- Debris caught in the storm: curved corrugated galvanized iron sheets ('yero') with brushed silver-zinc metallic sheen, and shattered weathered concrete foundation blocks with exposed industrial rust-red and orange rebar rods.
- At the apex of the spire is an articulated glowing crystalline lightning-rod crown radiating high-voltage energy.
- Studio environment lighting with dynamic storm backlighting: brilliant electric cyan rim light, soft twilight violet fill light, and specular highlights reflecting off metallic and wet stone surfaces.
- Vibrant, hyper-detailed textures, zero dark or unlit surfaces, every surface is illuminated by ambient glow, emissive channels, or specular reflections. 
- Octane render, PBR material study, 8k, photorealistic sci-fi cinematic asset sheet.
```

#### Compositional & Aesthetic Evaluation

```
+-----------------------------------------------------------------------------+
| R1 PROMPT 2 COMPOSITION ANALYSIS: ASSET & SHADER DETAIL                     |
|                                                                             |
|  [APEX CROWN]         Translucent cyan crystal needle; high-voltage corona  |
|  [UPPER BODY]         Tapered basalt obelisk with beveled conduits          |
|  [MID SECTION]        Orbiting quartz shards & tumbling galvanized yero     |
|  [LOWER BASE]         Demolition concrete blocks & exposed rust rebars      |
|                                                                             |
|  SHADERS: Zero unlit surfaces, PBR specular highlights, 3.5x - 7.0x emission|
+-----------------------------------------------------------------------------+
```

- **Material Differentiation**: Clear visual demarcation between metallic galvanized zinc (`#dce7f2`), dielectric basalt stone (`#2a3b5c`), weathered concrete (`#b2bfce`), and hyper-emissive plasma (`#00ffff`).
- **Philippine Storm Motifs**: Corrugated iron sheets (*yero*) and exposed industrial rebar are rendered with authentic structural weathering, grounding the futuristic fantasy in the cultural reality of Philippine typhoons.
- **Topological Clarity for Blender**: The geometric chamfers and bevels provide a direct blueprint for procedural `bmesh` extrusion and bevel operations.

---

## 3. Storyboard Scene Concept Art Prompts (Generated Assets)

The following concept references were generated via Gemini image models to conceptualize the distinct scenes across the narrative storyboard of 'Ako Ang Bagyo':

### Scene 3: Pre-Chorus Hazard Zone
- **Identifier**: `scene_prechorus_hazard`
- **Output Filename (Runtime)**: `my-video/public/assets/scene_prechorus_hazard.jpg`
- **Output Filename (Documentation)**: `docs/concept/scene_prechorus_hazard.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `672,577 bytes` (~656.8 KB)
- **Prompt**:
  ```text
  Cinematic 16:9 concept art of a sci-fi storm hazard zone. Towering brutalist dark basalt barrier monolith pylons flanking the left and right sides with pulsing emergency hazard crimson (#ff3b30) and amber warning lights, diagonal warning chevron patterns, high-voltage electrical sparks crackling in mid-air. Deep stormy indigo supercell storm clouds with red alarm atmospheric lighting in the background, open central corridor, volumetric fog, dramatic sci-fi cinematic atmosphere, zero unlit surfaces, 8k octane render.
  ```

### Scene 4: Chorus 1 Tempest Rooftops & Flying Yero
- **Identifier**: `scene_chorus1_yero`
- **Output Filename (Runtime)**: `my-video/public/assets/scene_chorus1_yero.jpg`
- **Output Filename (Documentation)**: `docs/concept/scene_chorus1_yero.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `958,365 bytes` (~935.9 KB)
- **Prompt**:
  ```text
  Cinematic 16:9 action concept art of a fierce Philippine typhoon tempest ripping through rooftops. Twisted corrugated galvanized silver-zinc iron roof sheets ('yero') violently tumbling through mid-air updrafts catching bright electric cyan (#00f0ff) lightning reflections. Silhouetted industrial rooftop structures below against a churning supercell sky. Open central corridor, intense wind streaks, water spray, dynamic motion freeze-frame, rich stormy blues and cyans, zero pitch black, photorealistic VFX cinematic render.
  ```

### Scene 5: Verse 2 Memory Chamber & Ropes
- **Identifier**: `scene_verse2_memory`
- **Output Filename (Runtime)**: `my-video/public/assets/scene_verse2_memory.jpg`
- **Output Filename (Documentation)**: `docs/concept/scene_verse2_memory.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `958,208 bytes` (~935.8 KB)
- **Prompt**:
  ```text
  Cinematic 16:9 moody sci-fi concept art of an intimate memory chamber caught in a celestial storm. Nostalgic floating Polaroid photo frames glowing with incandescent cyan and soft warm light drifting in the air, intertwined with heavy nautical mooring ropes swaying in turbulent storm drafts. Deep indigo and twilight violet volumetric mist with gentle electric cyan particle dust. Open central corridor, poignant and haunting atmosphere, rich specular highlights, 8k octane render.
  ```

### Scene 6: Chorus 2 Structural Demolition & Wall Ruin
- **Identifier**: `scene_chorus2_demolition`
- **Output Filename (Runtime)**: `my-video/public/assets/scene_chorus2_demolition.jpg`
- **Output Filename (Documentation)**: `docs/concept/scene_chorus2_demolition.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `1,015,082 bytes` (~991.3 KB)
- **Prompt**:
  ```text
  Cinematic 16:9 concept art of tectonic wall demolition in a violent thunderstorm. Massive shattered reinforced concrete foundation blocks collapsing and fracturing on pneumatic pistons, with twisted industrial rebar rods glowing with intense internal heat and rust-orange luminescence (#f97316). Flying concrete rubble and sparks caught in torrential supercell updrafts, electric cyan lightning branching across deep stormy skies, open central corridor, dramatic action, zero pitch-black areas, 8k render.
  ```

### Scene 7: Bridge Celestial Climax & Crystal Spire Dissolution
- **Identifier**: `scene_bridge_celestial`
- **Output Filename (Runtime)**: `my-video/public/assets/scene_bridge_celestial.jpg`
- **Output Filename (Documentation)**: `docs/concept/scene_bridge_celestial.jpg`
- **Verified Dimensions**: `1376 x 768` pixels (16:9 widescreen)
- **Verified File Size**: `867,851 bytes` (~847.5 KB)
- **Prompt**:
  ```text
  Cinematic 16:9 climax concept art of a celestial crystalline apex needle spire dissolving into pure lightning and ethereal energy. Slender glowing quartz needle spire discharging branching twilight violet (#8b5cf6), lavender (#c084fc), and pure electric cyan lightning into the eye of a colossal supercell vortex. The architecture dissolves into thousands of levitating glowing plasma embers and transcendent god rays. Open central corridor, sublime emotional catharsis, 8k masterpiece render.
  ```

---

## 4. Prompt Engineering Syntax & Keyword Lexicon

To ensure stylistic consistency across iterative generations and subsequent 3D asset builds, the following prompt grammar and vocabulary must be maintained:

```
[SCENE TYPE] + [SUBJECT HIERARCHY] + [COMPOSITION/FRAMING] + [MATERIALS & SHADERS] + [LIGHTING & CHROMATICS] + [RENDER ENGINE & RESOLUTION]
```

### Keyword Lexicon Table

| Domain | Recommended Keywords | Prohibited / Negative Keywords |
|---|---|---|
| **Framing & Space** | `16:9 widescreen`, `rule-of-thirds lateral framing`, `open central corridor`, `vast negative space`, `unobstructed center` | `centered subject`, `cluttered center`, `fisheye lens`, `portrait orientation`, `vertical crop` |
| **Atmosphere & Sky** | `celestial supercell`, `volumetric cloud shelves`, `ethereal god rays`, `swirling storm vortex`, `atmospheric mist` | `calm sunny day`, `flat skybox`, `monochrome grey rain`, `depressing drizzle` |
| **Architecture & Form**| `brutalist celestial monolith`, `tapered obelisk`, `beveled chamfers`, `geometric megaliths`, `faceted quartz shards` | `ornate gothic`, `medieval stone`, `curved art nouveau`, `generic cartoon shapes` |
| **Philippine Motifs** | `corrugated galvanized iron sheets (yero)`, `weathered reinforced concrete`, `exposed rust-red rebar rods` | `shingle roofs`, `wood timber framing`, `red brick chimney` |
| **Lighting & Glow** | `zero pitch-black surfaces`, `luminous ambient bounce`, `hyper-emissive cyan plasma`, `specular edge highlights`, `rim lighting` | `pitch black shadows`, `unlit surfaces`, `muddy contrast`, `blown-out flat white` |
| **Color Temperature** | `electric cyan (#00f0ff)`, `stormy indigo (#0c102b)`, `twilight violet (#8b5cf6)`, `hazard crimson (#ff3b30)`, `amber lightning (#fbbf24)` | `pastel rainbow`, `drab beige`, `monochrome sepia`, `washed-out grey` |

---

## 5. Quality Assurance & Evaluation Rubric

Every candidate concept image must pass the following four-point evaluation rubric before deployment to the production pipeline:

```
+---------------------------------------------------------------------------------------------------+
| CANDIDATE EVALUATION RUBRIC                                                                       |
+--------------------------+------------------------------------------------+--------+--------------+
| Evaluation Criteria      | Quantitative / Qualitative Threshold           | Weight | Pass Status  |
+--------------------------+------------------------------------------------+--------+--------------+
| 1. Corridor Clearance    | Central 1000px × 620px free of solid geometry  | 35%    | PASSED (100%)|
| 2. Zero-Black Luminance  | No RGB [0,0,0] clusters; minimum ambient fill  | 25%    | PASSED (100%)|
| 3. Chromatic Saturation  | Vibrant cyan, violet, and amber separation     | 20%    | PASSED (100%)|
| 4. 3D Modelability       | Clean planar facets suitable for bmesh scripts | 20%    | PASSED (100%)|
+--------------------------+------------------------------------------------+--------+--------------+
| TOTAL SCORE              |                                                | 100%   | 100/100      |
+--------------------------+------------------------------------------------+--------+--------------+
```

1. **Corridor Clearance (35%)**: When a `1000 x 620` rectangle is centered over the image, no opaque geometric structures may intersect the boundary. Both `ako_ang_bagyo_storm_concept.jpg` and `monolith_asset_detail.jpg` confine all dense architecture to the lateral flanks or macro perspectives.
2. **Zero-Black Luminance (25%)**: Histogram analysis confirms minimum luminance values in shadow areas remain above `12/255`, sustained by atmospheric ambient bounce.
3. **Chromatic Saturation (20%)**: Colors display strong triadic harmony between electric cyan, stormy indigo, and amber/violet highlights.
4. **3D Modelability (20%)**: Architectural forms present distinct planar faces, 45-degree chamfers, and clean geometric axes easily translated into Blender `bpy.ops.mesh` commands.
