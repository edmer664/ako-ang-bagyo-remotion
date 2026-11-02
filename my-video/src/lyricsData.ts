import { Easing, interpolate } from "remotion";

export interface SpatialCoord {
  x: number;
  y: number;
  z: number;
  rx: number; // rotateX in deg
  ry: number; // rotateY in deg
  rz: number; // rotateZ in deg
}

export type KineticAnimStyle =
  | "mask-wipe"
  | "char-stagger"
  | "blur-focus"
  | "dizzy-orbit"
  | "rooftop-tear"
  | "hazard-monolith"
  | "memory-polaroid"
  | "lightning-shatter"
  | "wall-demolition";

export interface LyricLine {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
  translation: string;
  section: "intro" | "verse1" | "prechorus" | "chorus" | "verse2" | "chorus2" | "bridge" | "outro";
  emphasisWords: string[];
  animStyle: KineticAnimStyle;
  camera: SpatialCoord;
  shakeIntensity?: number;
  hasLightning?: boolean;
}

export const FPS = 30;
export const TOTAL_DURATION_SEC = 277.5;
export const TOTAL_FRAMES = Math.ceil(TOTAL_DURATION_SEC * FPS); // 8325 frames

export const LYRICS: LyricLine[] = [
  // --- INTRO (00:00 - 00:26.34) ---
  {
    id: "intro-1",
    startSec: 0,
    endSec: 14,
    text: "SHEAN",
    translation: "AKO ANG BAGYO (I AM THE STORM)",
    section: "intro",
    emphasisWords: ["SHEAN", "BAGYO"],
    animStyle: "blur-focus",
    camera: { x: 0, y: -200, z: 800, rx: 15, ry: 0, rz: 0 },
  },
  {
    id: "intro-2",
    startSec: 14,
    endSec: 26.34,
    text: "AKO ANG BAGYO",
    translation: "A KINETIC MOTION GRAPHIC WORLD",
    section: "intro",
    emphasisWords: ["BAGYO"],
    animStyle: "hazard-monolith",
    camera: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
    hasLightning: true,
    shakeIntensity: 0.6,
  },

  // --- VERSE 1: THE DIZZY ORBIT (00:26.34 - 00:50.86) ---
  {
    id: "v1-1",
    startSec: 26.34,
    endSec: 31.91,
    text: "Pinaikutan mo 'ko sumunod mundo ko nahilo",
    translation: "You orbit around me, and the next, my world got dizzy",
    section: "verse1",
    emphasisWords: ["PINAIKUTAN", "MUNDO", "NAHILO"],
    animStyle: "dizzy-orbit",
    camera: { x: -350, y: -150, z: -400, rx: 10, ry: -20, rz: -8 },
    shakeIntensity: 0.3,
  },
  {
    id: "v1-2",
    startSec: 31.91,
    endSec: 37.92,
    text: "Hindi ko inakalang lalaki",
    translation: "I never thought that it'd get this bad",
    section: "verse1",
    emphasisWords: ["LALAKI", "HINDI"],
    animStyle: "mask-wipe",
    camera: { x: 300, y: 120, z: -800, rx: -8, ry: 15, rz: 5 },
  },
  {
    id: "v1-3",
    startSec: 37.92,
    endSec: 40.45,
    text: "Bumigat ang kalungkutan",
    translation: "The sadness became heavier",
    section: "verse1",
    emphasisWords: ["BUMIGAT", "KALUNGKUTAN"],
    animStyle: "char-stagger",
    camera: { x: -200, y: 280, z: -1200, rx: 12, ry: -10, rz: -4 },
  },
  {
    id: "v1-4",
    startSec: 40.45,
    endSec: 43.25,
    text: "Mga luha 'di napigilan",
    translation: "All the tears fell and I can't stop",
    section: "verse1",
    emphasisWords: ["LUHA", "NAPIGILAN"],
    animStyle: "blur-focus",
    camera: { x: 250, y: -100, z: -1600, rx: -5, ry: 8, rz: 3 },
  },
  {
    id: "v1-5",
    startSec: 43.25,
    endSec: 50.86,
    text: "Hanggang ngayo'y bumubuhos pa rin",
    translation: "Until now, they're still pouring",
    section: "verse1",
    emphasisWords: ["BUMUBUHOS"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 180, z: -2100, rx: 18, ry: 0, rz: 0 },
    hasLightning: true,
  },

  // --- PRE-CHORUS 1: HAZARD ZONE (00:50.86 - 01:00.13) ---
  {
    id: "pc1-1",
    startSec: 50.86,
    endSec: 55.75,
    text: "Matakot na kayo",
    translation: "Be terrified now",
    section: "prechorus",
    emphasisWords: ["MATAKOT"],
    animStyle: "hazard-monolith",
    camera: { x: -450, y: 200, z: -2700, rx: -15, ry: 20, rz: 6 },
    shakeIntensity: 0.6,
    hasLightning: true,
  },
  {
    id: "pc1-2",
    startSec: 55.75,
    endSec: 60.13,
    text: "Ako, ako ang bagyo",
    translation: "I am, I am the storm",
    section: "prechorus",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -3200, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 0.9,
    hasLightning: true,
  },

  // --- CHORUS 1: TEMPEST ROOFTOPS (01:00.13 - 01:32.13) ---
  {
    id: "c1-1",
    startSec: 60.13,
    endSec: 65.54,
    text: "Kulimlim ng langit sa inyong dalawa",
    translation: "The dark clouds shading both of you",
    section: "chorus",
    emphasisWords: ["KULIMLIM", "LANGIT"],
    animStyle: "char-stagger",
    camera: { x: 500, y: -220, z: -3800, rx: 8, ry: -25, rz: -7 },
  },
  {
    id: "c1-2",
    startSec: 65.54,
    endSec: 71.27,
    text: "Bulong ko sa hangin \"sana 'di kayo masaya\"",
    translation: "I whisper unhappiness to you in the wind",
    section: "chorus",
    emphasisWords: ["HANGIN", "'DI KAYO MASAYA"],
    animStyle: "blur-focus",
    camera: { x: -400, y: 150, z: -4300, rx: -10, ry: 15, rz: 4 },
  },
  {
    id: "c1-3",
    startSec: 71.27,
    endSec: 77.02,
    text: "Sa tibay ng bahay na titirhan n'yo",
    translation: "Even in the strength of the house you'll live",
    section: "chorus",
    emphasisWords: ["TIBAY", "BAHAY"],
    animStyle: "mask-wipe",
    camera: { x: 400, y: 220, z: -4900, rx: 12, ry: -12, rz: -5 },
  },
  {
    id: "c1-4",
    startSec: 77.02,
    endSec: 82.52,
    text: "Tatangayin ko bawat yero",
    translation: "I will rip every roof off of it",
    section: "chorus",
    emphasisWords: ["TATANGAYIN", "BAWAT YERO"],
    animStyle: "rooftop-tear",
    camera: { x: -300, y: -250, z: -5500, rx: -18, ry: 25, rz: 8 },
    shakeIntensity: 0.8,
    hasLightning: true,
  },
  {
    id: "c1-5",
    startSec: 82.52,
    endSec: 84.41,
    text: "Dahil ako",
    translation: "Because I am",
    section: "chorus",
    emphasisWords: ["DAHIL AKO"],
    animStyle: "hazard-monolith",
    camera: { x: 200, y: -80, z: -6000, rx: 5, ry: -8, rz: -2 },
  },
  {
    id: "c1-6",
    startSec: 84.41,
    endSec: 92.13,
    text: "Ako ang bagyo",
    translation: "I am the storm",
    section: "chorus",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -6500, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.0,
    hasLightning: true,
  },

  // --- VERSE 2: MEMORY CHAMBER & ROPES (01:32.13 - 01:56.25) ---
  {
    id: "v2-1",
    startSec: 92.13,
    endSec: 94.84,
    text: "Itinago na litrato",
    translation: "Hidden photos",
    section: "verse2",
    emphasisWords: ["ITINAGO", "LITRATO"],
    animStyle: "memory-polaroid",
    camera: { x: -450, y: -180, z: -7100, rx: 12, ry: -18, rz: -6 },
  },
  {
    id: "v2-2",
    startSec: 94.84,
    endSec: 97.67,
    text: "Kunwaring 'di ko nakita",
    translation: "Pretending that I didn't see",
    section: "verse2",
    emphasisWords: ["KUNWARI", "'DI NAKITA"],
    animStyle: "mask-wipe",
    camera: { x: 380, y: 150, z: -7600, rx: -10, ry: 20, rz: 5 },
  },
  {
    id: "v2-3",
    startSec: 97.67,
    endSec: 103.54,
    text: "Takot ka sigurong masalanta ko s'ya",
    translation: "Maybe you're scared I'll devastate her",
    section: "verse2",
    emphasisWords: ["TAKOT", "MASALANTA"],
    animStyle: "char-stagger",
    camera: { x: -350, y: 220, z: -8100, rx: 14, ry: -15, rz: -4 },
    shakeIntensity: 0.4,
  },
  {
    id: "v2-4",
    startSec: 103.54,
    endSec: 106.25,
    text: "Tingin mo ba 'di ko kaya?",
    translation: "Do you think that I can't do that?",
    section: "verse2",
    emphasisWords: ["TINGIN MO BA", "'DI KO KAYA"],
    animStyle: "hazard-monolith",
    camera: { x: 420, y: -140, z: -8600, rx: -8, ry: 18, rz: 7 },
  },
  {
    id: "v2-5",
    startSec: 106.25,
    endSec: 108.81,
    text: "Gusto mo na gusto kita",
    translation: "You like that I like you",
    section: "verse2",
    emphasisWords: ["GUSTO MO", "GUSTO KITA"],
    animStyle: "dizzy-orbit",
    camera: { x: -280, y: -100, z: -9100, rx: 6, ry: -12, rz: -3 },
  },
  {
    id: "v2-6",
    startSec: 108.81,
    endSec: 116.25,
    text: "Tinatali mo 'ko sa pag-asa",
    translation: "You strangle me with the ropes of hope",
    section: "verse2",
    emphasisWords: ["TINATALI", "PAG-ASA"],
    animStyle: "blur-focus",
    camera: { x: 0, y: 120, z: -9700, rx: 15, ry: 0, rz: 0 },
    shakeIntensity: 0.5,
  },

  // --- PRE-CHORUS 2: WARNING SURGE (01:56.25 - 02:05.86) ---
  {
    id: "pc2-1",
    startSec: 116.25,
    endSec: 121.12,
    text: "Matakot na kayo",
    translation: "Be terrified now",
    section: "prechorus",
    emphasisWords: ["MATAKOT"],
    animStyle: "hazard-monolith",
    camera: { x: -450, y: 220, z: -10300, rx: -15, ry: 22, rz: 7 },
    shakeIntensity: 0.7,
    hasLightning: true,
  },
  {
    id: "pc2-2",
    startSec: 121.12,
    endSec: 125.86,
    text: "Ako, ako, ako ang bagyo",
    translation: "I am, I am, I am the storm",
    section: "prechorus",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -10800, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.0,
    hasLightning: true,
  },

  // --- CHORUS 2: WALL DEMOLITION (02:05.86 - 03:05.81) ---
  {
    id: "c2-1",
    startSec: 125.86,
    endSec: 131.42,
    text: "Kulimlim ng langit sa inyong dalawa",
    translation: "The dark clouds shading both of you",
    section: "chorus",
    emphasisWords: ["KULIMLIM", "LANGIT"],
    animStyle: "char-stagger",
    camera: { x: 480, y: -200, z: -11400, rx: 8, ry: -20, rz: -6 },
  },
  {
    id: "c2-2",
    startSec: 131.42,
    endSec: 136.97,
    text: "Bulong ko sa hangin sana 'di kayo masaya",
    translation: "I whisper unhappiness to you in the wind",
    section: "chorus",
    emphasisWords: ["BULONG", "SANA 'DI KAYO MASAYA"],
    animStyle: "blur-focus",
    camera: { x: -420, y: 160, z: -11900, rx: -12, ry: 15, rz: 5 },
  },
  {
    id: "c2-3",
    startSec: 136.97,
    endSec: 142.91,
    text: "Sa tibay ng bahay na titirhan n'yo",
    translation: "Even in the strength of the house you'll live",
    section: "chorus",
    emphasisWords: ["TIBAY", "BAHAY"],
    animStyle: "mask-wipe",
    camera: { x: 380, y: 240, z: -12500, rx: 14, ry: -14, rz: -5 },
  },
  {
    id: "c2-4",
    startSec: 142.91,
    endSec: 148.85,
    text: "Tatangayin ko bawat yero",
    translation: "I will rip every roof off of it",
    section: "chorus",
    emphasisWords: ["TATANGAYIN", "BAWAT YERO"],
    animStyle: "rooftop-tear",
    camera: { x: -350, y: -240, z: -13100, rx: -18, ry: 25, rz: 9 },
    shakeIntensity: 0.8,
    hasLightning: true,
  },
  {
    id: "c2-5",
    startSec: 148.85,
    endSec: 154.19,
    text: "Dilim ng paligid, buhos ng emosyon",
    translation: "The darkness of the land, the emotions pour",
    section: "chorus2",
    emphasisWords: ["DILIM", "BUHOS NG EMOSYON"],
    animStyle: "char-stagger",
    camera: { x: 450, y: -160, z: -13700, rx: 10, ry: -18, rz: -6 },
    hasLightning: true,
  },
  {
    id: "c2-6",
    startSec: 154.19,
    endSec: 159.85,
    text: "Tunog ng pag-ibig sa sama ng panahon",
    translation: "The sound of love in midst of the bad weather",
    section: "chorus2",
    emphasisWords: ["PAG-IBIG", "SAMA NG PANOHON"],
    animStyle: "blur-focus",
    camera: { x: -380, y: 180, z: -14300, rx: -10, ry: 15, rz: 4 },
  },
  {
    id: "c2-7",
    startSec: 159.85,
    endSec: 165.80,
    text: "Sa tibay ng bahay na titirhan n'yo",
    translation: "Even in the strength of the house you'll live",
    section: "chorus2",
    emphasisWords: ["TIBAY", "BAHAY"],
    animStyle: "mask-wipe",
    camera: { x: 350, y: 220, z: -14900, rx: 14, ry: -12, rz: -5 },
  },
  {
    id: "c2-8",
    startSec: 165.80,
    endSec: 170.97,
    text: "Gigibain ko mga pader n'yo",
    translation: "I will wreck every wall off of it",
    section: "chorus2",
    emphasisWords: ["GIGIBAIN", "MGA PADER N'YO"],
    animStyle: "wall-demolition",
    camera: { x: -450, y: -200, z: -15500, rx: -20, ry: 28, rz: 10 },
    shakeIntensity: 1.1,
    hasLightning: true,
  },
  {
    id: "c2-9",
    startSec: 170.97,
    endSec: 185.81,
    text: "Dahil ako, ako ang bagyo",
    translation: "Because I am, I am the storm",
    section: "chorus2",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -16100, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 0.9,
    hasLightning: true,
  },

  // --- BRIDGE: THE RAINING VOID (03:05.81 - 04:06.68) ---
  {
    id: "b-1",
    startSec: 185.81,
    endSec: 188.08,
    text: "Lahat ng hahawakan ko",
    translation: "Everything I touch",
    section: "bridge",
    emphasisWords: ["HAHAWAKAN"],
    animStyle: "mask-wipe",
    camera: { x: -300, y: 150, z: -16800, rx: 8, ry: -10, rz: -3 },
  },
  {
    id: "b-2",
    startSec: 188.08,
    endSec: 190.88,
    text: "Lagi sa 'kin na lumalayo",
    translation: "Always stray away from me",
    section: "bridge",
    emphasisWords: ["LUMALAYO"],
    animStyle: "char-stagger",
    camera: { x: 320, y: -120, z: -17300, rx: -6, ry: 12, rz: 4 },
  },
  {
    id: "b-3",
    startSec: 190.88,
    endSec: 194.12,
    text: "Lahat ng tao na nariyan",
    translation: "Every person that comes to me",
    section: "bridge",
    emphasisWords: ["LAHAT NG TAO"],
    animStyle: "blur-focus",
    camera: { x: -280, y: 200, z: -17800, rx: 10, ry: -8, rz: -3 },
  },
  {
    id: "b-4",
    startSec: 194.12,
    endSec: 197.00,
    text: "Sa tuwing lalapit ay nasasaktan",
    translation: "Gets hurt whenever they get close",
    section: "bridge",
    emphasisWords: ["NASASAKTAN"],
    animStyle: "dizzy-orbit",
    camera: { x: 300, y: -150, z: -18300, rx: -10, ry: 14, rz: 5 },
    shakeIntensity: 0.4,
  },
  {
    id: "b-5",
    startSec: 197.00,
    endSec: 199.92,
    text: "At 'pag nagsawa na sila sa akin",
    translation: "And if they get tired of me",
    section: "bridge",
    emphasisWords: ["NAGSAWA"],
    animStyle: "mask-wipe",
    camera: { x: -350, y: 140, z: -18800, rx: 8, ry: -12, rz: -4 },
  },
  {
    id: "b-6",
    startSec: 199.92,
    endSec: 203.35,
    text: "'Pag wala na sa 'kin na nakatingin",
    translation: "If no one's looking at me anymore",
    section: "bridge",
    emphasisWords: ["WALA NANG NAKATINGIN"],
    animStyle: "char-stagger",
    camera: { x: 380, y: -160, z: -19300, rx: -8, ry: 15, rz: 5 },
  },
  {
    id: "b-7",
    startSec: 203.35,
    endSec: 205.64,
    text: "'Pag hindi na 'ko nakakatawa",
    translation: "If I'm not funny anymore",
    section: "bridge",
    emphasisWords: ["'DI NA NAKAKATAWA"],
    animStyle: "blur-focus",
    camera: { x: -320, y: 180, z: -19800, rx: 10, ry: -10, rz: -3 },
  },
  {
    id: "b-8",
    startSec: 205.64,
    endSec: 208.0,
    text: "Ako 'yung laging naiiwang mag-isa",
    translation: "I'm always the one left alone",
    section: "bridge",
    emphasisWords: ["NAIIWANG MAG-ISA"],
    animStyle: "hazard-monolith",
    camera: { x: 0, y: 0, z: -20400, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 0.5,
  },
  {
    id: "b-9",
    startSec: 208.2,
    endSec: 210.6,
    text: "Kahit pa na subukan ko ang lahat",
    translation: "Even if I do everything that I can",
    section: "bridge",
    emphasisWords: ["LAHAT"],
    animStyle: "char-stagger",
    camera: { x: 0, y: 0, z: -21000, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "b-10",
    startSec: 210.8,
    endSec: 213.5,
    text: "Makakaya ko ay 'di pa rin naman sapat",
    translation: "It still wouldn't be enough if you think about it",
    section: "bridge",
    emphasisWords: ["'DI PA RIN SAPAT"],
    animStyle: "mask-wipe",
    camera: { x: 0, y: 0, z: -21600, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "b-11",
    startSec: 213.8,
    endSec: 217.0,
    text: "Kung iisipin mo ang lalaki ko puro lang sugat",
    translation: "No one will come close if all they get are wounds",
    section: "bridge",
    emphasisWords: ["PURO LANG SUGAT"],
    animStyle: "hazard-monolith",
    camera: { x: 0, y: 0, z: -22200, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 0.5,
  },
  {
    id: "b-12",
    startSec: 217.2,
    endSec: 219.4,
    text: "Matatamo nila",
    translation: "That they will receive",
    section: "bridge",
    emphasisWords: ["MATATAMO NILA"],
    animStyle: "blur-focus",
    camera: { x: 0, y: 0, z: -22600, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "b-13",
    startSec: 219.7,
    endSec: 222.1,
    text: "At sa tagal ko na binitbit ang bigat",
    translation: "And for the longest time that I've held this weight",
    section: "bridge",
    emphasisWords: ["BINITBIT", "BIGAT"],
    animStyle: "char-stagger",
    camera: { x: 0, y: 0, z: -22900, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "b-14",
    startSec: 222.3,
    endSec: 224.9,
    text: "Konting galaw mo lang ay kidlat sa dibdib ko",
    translation: "In just one small move, lightning roars in my chest",
    section: "bridge",
    emphasisWords: ["KIDLAT", "DIBDIB KO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -23400, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.2,
    hasLightning: true,
  },
  {
    id: "b-15",
    startSec: 225.0,
    endSec: 227.8,
    text: "'Di ko naman gusto na saktan kita",
    translation: "I don't want to hurt you",
    section: "bridge",
    emphasisWords: ["'DI GUSTO", "SAKTAN"],
    animStyle: "blur-focus",
    camera: { x: 0, y: 0, z: -24000, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "b-16",
    startSec: 228.0,
    endSec: 230.5,
    text: "Kaya mag-ingat ka...",
    translation: "So be careful...",
    section: "bridge",
    emphasisWords: ["MAG-INGAT KA"],
    animStyle: "hazard-monolith",
    camera: { x: 0, y: 0, z: -24500, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 0.8,
  },
  {
    id: "o-1",
    startSec: 230.8,
    endSec: 233.8,
    text: "Ako ang bagyo...",
    translation: "I am the storm...",
    section: "outro",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -24900, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.0,
    hasLightning: true,
  },
  {
    id: "o-2",
    startSec: 234.4,
    endSec: 239.5,
    text: "Kulimlim ng langit sa inyong dalawa",
    translation: "The dark clouds shading both of you",
    section: "outro",
    emphasisWords: ["KULIMLIM", "LANGIT"],
    animStyle: "char-stagger",
    camera: { x: 0, y: 0, z: -25400, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "o-3",
    startSec: 240.0,
    endSec: 245.0,
    text: "Bulong ko sa hangin \"sana 'di kayo masaya\"",
    translation: "I whisper unhappiness to you in the wind",
    section: "outro",
    emphasisWords: ["BULONG", "'DI KAYO MASAYA"],
    animStyle: "blur-focus",
    camera: { x: 0, y: 0, z: -26000, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "o-4",
    startSec: 245.6,
    endSec: 251.0,
    text: "Sa tibay ng bahay na titirhan n'yo",
    translation: "Even in the strength of the house you'll live",
    section: "outro",
    emphasisWords: ["TIBAY", "BAHAY"],
    animStyle: "mask-wipe",
    camera: { x: 0, y: 0, z: -26600, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "o-5",
    startSec: 251.3,
    endSec: 256.5,
    text: "Tatangayin ko bawat yero",
    translation: "I will rip every roof off of it",
    section: "outro",
    emphasisWords: ["TATANGAYIN", "BAWAT YERO"],
    animStyle: "rooftop-tear",
    camera: { x: 0, y: 0, z: -27200, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.0,
    hasLightning: true,
  },
  {
    id: "o-6",
    startSec: 257.5,
    endSec: 261.5,
    text: "Kahit na matunaw ako",
    translation: "Even if I melt away",
    section: "outro",
    emphasisWords: ["MATUNAW AKO"],
    animStyle: "blur-focus",
    camera: { x: 0, y: 0, z: -27600, rx: 0, ry: 0, rz: 0 },
  },
  {
    id: "o-7",
    startSec: 262.4,
    endSec: 277.42,
    text: "Dahil ako, ako ang bagyo",
    translation: "Because I am, I am the storm",
    section: "outro",
    emphasisWords: ["AKO", "BAGYO"],
    animStyle: "lightning-shatter",
    camera: { x: 0, y: 0, z: -28100, rx: 0, ry: 0, rz: 0 },
    shakeIntensity: 1.4,
    hasLightning: true,
  },
];

export const getActiveLineIndex = (timeSec: number): number => {
  for (let i = 0; i < LYRICS.length; i++) {
    if (timeSec < LYRICS[i].endSec) {
      return i;
    }
  }
  return LYRICS.length - 1;
};

export const getCameraForFrame = (frame: number, fps: number): SpatialCoord => {
  const currentTimeSec = frame / fps;
  const activeIndex = getActiveLineIndex(currentTimeSec);
  const currentLine = LYRICS[activeIndex];
  const prevLine = activeIndex > 0 ? LYRICS[activeIndex - 1] : currentLine;
  const nextLine =
    activeIndex < LYRICS.length - 1 ? LYRICS[activeIndex + 1] : currentLine;

  const startF = Math.round(currentLine.startSec * fps);
  const endF = Math.round(currentLine.endSec * fps);
  const localF = Math.max(0, frame - startF);
  const lineDuration = Math.max(1, endF - startF);

  // Normalized time across the line: 0.0 to 1.0
  const u = Math.min(1, localF / lineDuration);

  // Dynamic arrival and departure windows
  const arrivalRatio = Math.min(0.28, 20 / lineDuration);
  const departRatio = Math.max(0.72, 1 - 20 / lineDuration);

  let baseX: number;
  let baseY: number;
  let baseZ: number;
  let baseRx: number;
  let baseRy: number;
  let baseRz: number;

  if (u < arrivalRatio) {
    // Phase 1: Arrive from previous waypoint into current waypoint
    const pIn = interpolate(u, [0, arrivalRatio], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    baseX = interpolate(pIn, [0, 1], [prevLine.camera.x, currentLine.camera.x]);
    baseY = interpolate(pIn, [0, 1], [prevLine.camera.y, currentLine.camera.y]);
    baseZ = interpolate(pIn, [0, 1], [prevLine.camera.z, currentLine.camera.z]);
    baseRx = interpolate(
      pIn,
      [0, 1],
      [prevLine.camera.rx, currentLine.camera.rx]
    );
    baseRy = interpolate(
      pIn,
      [0, 1],
      [prevLine.camera.ry, currentLine.camera.ry]
    );
    baseRz = interpolate(
      pIn,
      [0, 1],
      [prevLine.camera.rz, currentLine.camera.rz]
    );
  } else if (u > departRatio) {
    // Phase 3: Accelerate and whip into next waypoint
    const pOut = interpolate(u, [departRatio, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.5, 0, 0.8, 0.2),
    });
    baseX = interpolate(pOut, [0, 1], [currentLine.camera.x, nextLine.camera.x]);
    baseY = interpolate(pOut, [0, 1], [currentLine.camera.y, nextLine.camera.y]);
    baseZ = interpolate(pOut, [0, 1], [currentLine.camera.z, nextLine.camera.z]);
    baseRx = interpolate(
      pOut,
      [0, 1],
      [currentLine.camera.rx, nextLine.camera.rx]
    );
    baseRy = interpolate(
      pOut,
      [0, 1],
      [currentLine.camera.ry, nextLine.camera.ry]
    );
    baseRz = interpolate(
      pOut,
      [0, 1],
      [currentLine.camera.rz, nextLine.camera.rz]
    );
  } else {
    // Phase 2: Steady reading phase
    baseX = currentLine.camera.x;
    baseY = currentLine.camera.y;
    baseZ = currentLine.camera.z;
    baseRx = currentLine.camera.rx;
    baseRy = currentLine.camera.ry;
    baseRz = currentLine.camera.rz;
  }

  // Continuous cinematic forward dolly through space (150px forward travel)
  const forwardDolly = (u - 0.5) * 150;

  // Gentle organic orbital tracking sway
  const orbitalSwayX = Math.sin((localF / fps) * 1.6) * 35;
  const orbitalSwayY = Math.cos((localF / fps) * 1.4) * 22;
  const angularDriftY = Math.sin((localF / fps) * 1.2) * 2.5;
  const angularDriftZ = Math.cos((localF / fps) * 1.5) * 1.8;

  // Section-specific transition impulses
  let transitionImpulseRy = 0;
  let transitionImpulseRz = 0;
  let transitionImpulseRx = 0;

  if (u > departRatio && currentLine.section !== nextLine.section) {
    const pTrans = interpolate(u, [departRatio, 1], [0, 1]);
    const peak = Math.sin(pTrans * Math.PI);

    if (nextLine.section === "chorus" || nextLine.section === "chorus2") {
      transitionImpulseRy = peak * (activeIndex % 2 === 0 ? 4 : -4);
      transitionImpulseRz = peak * 2;
    } else if (nextLine.section === "outro") {
      transitionImpulseRx = -peak * 4;
    } else if (nextLine.section === "prechorus") {
      transitionImpulseRz = peak * 2;
    } else if (nextLine.section === "bridge") {
      transitionImpulseRx = peak * 3;
    }
  }

  return {
    x: baseX + orbitalSwayX,
    y: baseY + orbitalSwayY,
    z: baseZ + forwardDolly,
    rx: baseRx + transitionImpulseRx,
    ry: baseRy + angularDriftY + transitionImpulseRy,
    rz: baseRz + angularDriftZ + transitionImpulseRz,
  };
};

