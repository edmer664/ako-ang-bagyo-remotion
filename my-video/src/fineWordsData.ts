export interface TimedWord {
  word: string;
  startSec: number;
  endSec: number;
  isEmphasis?: boolean;
}

export type KineticOrientation =
  | "horizontal"
  | "vertical-stack"
  | "diagonal-up"
  | "diagonal-down"
  | "split-flank"
  | "monolith-center"
  | "cross-tilt";

export interface LineWordData {
  id: string;
  orientation: KineticOrientation;
  words: TimedWord[];
}

export const FINE_WORD_DATA: Record<string, LineWordData> = {
  "intro-1": {
    id: "intro-1",
    orientation: "monolith-center",
    words: [
      { word: "SHEAN", startSec: 0.00, endSec: 14.00, isEmphasis: false },
    ],
  },
  "intro-2": {
    id: "intro-2",
    orientation: "monolith-center",
    words: [
      { word: "AKO", startSec: 14.00, endSec: 26.34, isEmphasis: false },
      { word: "ANG", startSec: 14.00, endSec: 26.34, isEmphasis: false },
      { word: "BAGYO", startSec: 14.00, endSec: 26.34, isEmphasis: false },
    ],
  },
  "v1-1": {
    id: "v1-1",
    orientation: "horizontal",
    words: [
      { word: "Pinaikutan", startSec: 26.59, endSec: 27.34, isEmphasis: true },
      { word: "mo", startSec: 27.34, endSec: 27.52, isEmphasis: false },
      { word: "'ko", startSec: 27.52, endSec: 27.75, isEmphasis: false },
      { word: "sumunod", startSec: 28.32, endSec: 28.87, isEmphasis: true },
      { word: "mundo", startSec: 29.07, endSec: 29.47, isEmphasis: true },
      { word: "ko", startSec: 29.47, endSec: 29.67, isEmphasis: false },
      { word: "nahilo", startSec: 29.87, endSec: 30.37, isEmphasis: true },
    ],
  },
  "v1-2": {
    id: "v1-2",
    orientation: "diagonal-down",
    words: [
      { word: "Hindi", startSec: 32.22, endSec: 32.62, isEmphasis: true },
      { word: "ko", startSec: 32.62, endSec: 32.82, isEmphasis: false },
      { word: "inakalang", startSec: 33.17, endSec: 33.87, isEmphasis: true },
      { word: "lalaki", startSec: 34.17, endSec: 34.77, isEmphasis: true },
    ],
  },
  "v1-3": {
    id: "v1-3",
    orientation: "vertical-stack",
    words: [
      { word: "Bumigat", startSec: 38.32, endSec: 38.82, isEmphasis: true },
      { word: "ang", startSec: 38.82, endSec: 39.02, isEmphasis: false },
      { word: "kalungkutan", startSec: 39.27, endSec: 40.07, isEmphasis: true },
    ],
  },
  "v1-4": {
    id: "v1-4",
    orientation: "horizontal",
    words: [
      { word: "Mga", startSec: 40.67, endSec: 40.92, isEmphasis: false },
      { word: "luha", startSec: 41.07, endSec: 41.42, isEmphasis: true },
      { word: "'di", startSec: 41.57, endSec: 41.77, isEmphasis: false },
      { word: "napigilan", startSec: 41.97, endSec: 42.67, isEmphasis: true },
    ],
  },
  "v1-5": {
    id: "v1-5",
    orientation: "diagonal-up",
    words: [
      { word: "Hanggang", startSec: 43.72, endSec: 44.22, isEmphasis: true },
      { word: "ngayo'y", startSec: 44.42, endSec: 44.77, isEmphasis: false },
      { word: "bumubuhos", startSec: 44.97, endSec: 45.67, isEmphasis: true },
      { word: "pa", startSec: 45.77, endSec: 45.92, isEmphasis: false },
      { word: "rin", startSec: 46.02, endSec: 46.37, isEmphasis: true },
    ],
  },
  "pc1-1": {
    id: "pc1-1",
    orientation: "monolith-center",
    words: [
      { word: "Matakot", startSec: 51.32, endSec: 51.92, isEmphasis: true },
      { word: "na", startSec: 52.02, endSec: 52.17, isEmphasis: false },
      { word: "kayo", startSec: 52.27, endSec: 52.77, isEmphasis: true },
    ],
  },
  "pc1-2": {
    id: "pc1-2",
    orientation: "cross-tilt",
    words: [
      { word: "Ako,", startSec: 55.75, endSec: 56.40, isEmphasis: true },
      { word: "ako", startSec: 56.90, endSec: 57.40, isEmphasis: true },
      { word: "ang", startSec: 57.40, endSec: 57.65, isEmphasis: false },
      { word: "bagyo", startSec: 57.65, endSec: 58.70, isEmphasis: true },
    ],
  },
  "c1-1": {
    id: "c1-1",
    orientation: "cross-tilt",
    words: [
      { word: "Kulimlim", startSec: 60.13, endSec: 60.80, isEmphasis: true },
      { word: "ng", startSec: 60.80, endSec: 60.95, isEmphasis: false },
      { word: "langit", startSec: 60.95, endSec: 61.50, isEmphasis: true },
      { word: "sa", startSec: 61.50, endSec: 61.65, isEmphasis: false },
      { word: "inyong", startSec: 61.65, endSec: 62.10, isEmphasis: false },
      { word: "dalawa", startSec: 62.10, endSec: 62.80, isEmphasis: true },
    ],
  },
  "c1-2": {
    id: "c1-2",
    orientation: "cross-tilt",
    words: [
      { word: "Bulong", startSec: 65.54, endSec: 66.10, isEmphasis: true },
      { word: "ko", startSec: 66.10, endSec: 66.25, isEmphasis: false },
      { word: "sa", startSec: 66.25, endSec: 66.40, isEmphasis: false },
      { word: "hangin", startSec: 66.40, endSec: 67.00, isEmphasis: true },
    ],
  },
  "c1-3": {
    id: "c1-3",
    orientation: "cross-tilt",
    words: [
      { word: "Sa", startSec: 71.27, endSec: 71.45, isEmphasis: false },
      { word: "tibay", startSec: 71.45, endSec: 71.85, isEmphasis: true },
      { word: "ng", startSec: 71.85, endSec: 72.00, isEmphasis: false },
      { word: "bahay", startSec: 72.00, endSec: 72.40, isEmphasis: true },
      { word: "na", startSec: 72.40, endSec: 72.55, isEmphasis: false },
      { word: "titirhan", startSec: 72.55, endSec: 73.15, isEmphasis: true },
      { word: "n'yo", startSec: 73.15, endSec: 73.50, isEmphasis: true },
    ],
  },
  "c1-4": {
    id: "c1-4",
    orientation: "vertical-stack",
    words: [
      { word: "Tatangayin", startSec: 77.02, endSec: 77.70, isEmphasis: true },
      { word: "ko", startSec: 77.70, endSec: 77.85, isEmphasis: false },
      { word: "bawat", startSec: 77.85, endSec: 78.25, isEmphasis: true },
      { word: "yero", startSec: 78.25, endSec: 78.85, isEmphasis: true },
    ],
  },
  "c1-5": {
    id: "c1-5",
    orientation: "diagonal-up",
    words: [
      { word: "Dahil", startSec: 82.52, endSec: 82.90, isEmphasis: false },
      { word: "ako", startSec: 82.90, endSec: 83.25, isEmphasis: true },
    ],
  },
  "c1-6": {
    id: "c1-6",
    orientation: "monolith-center",
    words: [
      { word: "Ako", startSec: 84.41, endSec: 84.80, isEmphasis: true },
      { word: "ang", startSec: 84.80, endSec: 84.95, isEmphasis: false },
      { word: "bagyo", startSec: 84.95, endSec: 85.60, isEmphasis: true },
    ],
  },
  "v2-1": {
    id: "v2-1",
    orientation: "horizontal",
    words: [
      { word: "Itinago", startSec: 92.13, endSec: 92.70, isEmphasis: true },
      { word: "na", startSec: 92.70, endSec: 92.85, isEmphasis: false },
      { word: "litrato", startSec: 92.85, endSec: 93.45, isEmphasis: true },
    ],
  },
  "v2-2": {
    id: "v2-2",
    orientation: "horizontal",
    words: [
      { word: "Kunwaring", startSec: 94.97, endSec: 95.59, isEmphasis: false },
      { word: "'di", startSec: 95.59, endSec: 95.79, isEmphasis: false },
      { word: "ko", startSec: 95.79, endSec: 95.97, isEmphasis: false },
      { word: "nakita", startSec: 96.07, endSec: 96.64, isEmphasis: false },
    ],
  },
  "v2-3": {
    id: "v2-3",
    orientation: "horizontal",
    words: [
      { word: "Takot", startSec: 97.80, endSec: 98.20, isEmphasis: true },
      { word: "ka", startSec: 98.20, endSec: 98.35, isEmphasis: false },
      { word: "sigurong", startSec: 98.45, endSec: 98.90, isEmphasis: false },
      { word: "masalanta", startSec: 99.00, endSec: 99.55, isEmphasis: false },
      { word: "ko", startSec: 99.55, endSec: 99.70, isEmphasis: false },
      { word: "s'ya", startSec: 99.70, endSec: 100.20, isEmphasis: false },
    ],
  },
  "v2-4": {
    id: "v2-4",
    orientation: "diagonal-up",
    words: [
      { word: "Tingin", startSec: 103.70, endSec: 104.05, isEmphasis: false },
      { word: "mo", startSec: 104.05, endSec: 104.20, isEmphasis: false },
      { word: "ba", startSec: 104.20, endSec: 104.35, isEmphasis: false },
      { word: "'di", startSec: 104.45, endSec: 104.60, isEmphasis: false },
      { word: "ko", startSec: 104.60, endSec: 104.75, isEmphasis: false },
      { word: "kaya?", startSec: 104.85, endSec: 105.35, isEmphasis: true },
    ],
  },
  "v2-5": {
    id: "v2-5",
    orientation: "horizontal",
    words: [
      { word: "Gusto", startSec: 106.40, endSec: 106.75, isEmphasis: false },
      { word: "mo", startSec: 106.75, endSec: 106.90, isEmphasis: false },
      { word: "na", startSec: 106.90, endSec: 107.05, isEmphasis: false },
      { word: "gusto", startSec: 107.15, endSec: 107.50, isEmphasis: false },
      { word: "kita", startSec: 107.50, endSec: 107.90, isEmphasis: false },
    ],
  },
  "v2-6": {
    id: "v2-6",
    orientation: "diagonal-down",
    words: [
      { word: "Tinatali", startSec: 109.00, endSec: 109.55, isEmphasis: false },
      { word: "mo", startSec: 109.55, endSec: 109.70, isEmphasis: false },
      { word: "'ko", startSec: 109.70, endSec: 109.85, isEmphasis: false },
      { word: "sa", startSec: 109.85, endSec: 110.00, isEmphasis: false },
      { word: "pag-asa", startSec: 110.10, endSec: 110.80, isEmphasis: true },
    ],
  },
  "pc2-1": {
    id: "pc2-1",
    orientation: "monolith-center",
    words: [
      { word: "Matakot", startSec: 116.40, endSec: 117.00, isEmphasis: true },
      { word: "na", startSec: 117.00, endSec: 117.15, isEmphasis: false },
      { word: "kayo", startSec: 117.15, endSec: 117.65, isEmphasis: true },
    ],
  },
  "pc2-2": {
    id: "pc2-2",
    orientation: "cross-tilt",
    words: [
      { word: "Ako,", startSec: 121.40, endSec: 121.75, isEmphasis: true },
      { word: "ako,", startSec: 121.90, endSec: 122.25, isEmphasis: true },
      { word: "ako", startSec: 122.40, endSec: 122.70, isEmphasis: true },
      { word: "ang", startSec: 122.70, endSec: 122.85, isEmphasis: false },
      { word: "bagyo", startSec: 122.95, endSec: 123.50, isEmphasis: true },
    ],
  },
  "c2-1": {
    id: "c2-1",
    orientation: "vertical-stack",
    words: [
      { word: "Kulimlim", startSec: 126.00, endSec: 126.60, isEmphasis: true },
      { word: "ng", startSec: 126.60, endSec: 126.70, isEmphasis: false },
      { word: "langit", startSec: 126.80, endSec: 127.25, isEmphasis: true },
      { word: "sa", startSec: 127.25, endSec: 127.40, isEmphasis: false },
      { word: "inyong", startSec: 127.50, endSec: 127.85, isEmphasis: false },
      { word: "dalawa", startSec: 127.95, endSec: 128.55, isEmphasis: true },
    ],
  },
  "c2-2": {
    id: "c2-2",
    orientation: "diagonal-down",
    words: [
      { word: "Bulong", startSec: 131.42, endSec: 131.78, isEmphasis: true },
      { word: "ko", startSec: 131.78, endSec: 131.98, isEmphasis: false },
      { word: "sa", startSec: 131.98, endSec: 132.18, isEmphasis: false },
      { word: "hangin", startSec: 132.18, endSec: 132.68, isEmphasis: true },
      { word: "sana", startSec: 132.98, endSec: 133.28, isEmphasis: false },
      { word: "'di", startSec: 133.28, endSec: 133.48, isEmphasis: false },
      { word: "kayo", startSec: 133.48, endSec: 133.78, isEmphasis: false },
      { word: "masaya", startSec: 133.78, endSec: 134.48, isEmphasis: true },
    ],
  },
  "c2-3": {
    id: "c2-3",
    orientation: "diagonal-up",
    words: [
      { word: "Sa", startSec: 137.08, endSec: 137.28, isEmphasis: false },
      { word: "tibay", startSec: 137.28, endSec: 137.68, isEmphasis: true },
      { word: "ng", startSec: 137.68, endSec: 137.78, isEmphasis: false },
      { word: "bahay", startSec: 137.78, endSec: 138.28, isEmphasis: true },
      { word: "na", startSec: 138.28, endSec: 138.48, isEmphasis: false },
      { word: "titirhan", startSec: 138.48, endSec: 139.18, isEmphasis: true },
      { word: "n'yo", startSec: 139.18, endSec: 139.58, isEmphasis: true },
    ],
  },
  "c2-4": {
    id: "c2-4",
    orientation: "vertical-stack",
    words: [
      { word: "Tatangayin", startSec: 143.08, endSec: 143.88, isEmphasis: true },
      { word: "ko", startSec: 143.88, endSec: 144.08, isEmphasis: false },
      { word: "bawat", startSec: 144.08, endSec: 144.48, isEmphasis: true },
      { word: "yero", startSec: 144.48, endSec: 145.08, isEmphasis: true },
    ],
  },
  "c2-5": {
    id: "c2-5",
    orientation: "diagonal-down",
    words: [
      { word: "Dilim", startSec: 148.85, endSec: 149.25, isEmphasis: true },
      { word: "ng", startSec: 149.25, endSec: 149.35, isEmphasis: false },
      { word: "paligid,", startSec: 149.35, endSec: 149.95, isEmphasis: true },
      { word: "buhos", startSec: 150.45, endSec: 150.85, isEmphasis: true },
      { word: "ng", startSec: 150.85, endSec: 150.95, isEmphasis: false },
      { word: "emosyon", startSec: 150.95, endSec: 151.65, isEmphasis: true },
    ],
  },
  "c2-6": {
    id: "c2-6",
    orientation: "diagonal-up",
    words: [
      { word: "Tunog", startSec: 154.45, endSec: 154.85, isEmphasis: true },
      { word: "ng", startSec: 154.85, endSec: 154.95, isEmphasis: false },
      { word: "pag-ibig", startSec: 154.95, endSec: 155.65, isEmphasis: true },
      { word: "sa", startSec: 155.95, endSec: 156.15, isEmphasis: false },
      { word: "sama", startSec: 156.15, endSec: 156.55, isEmphasis: true },
      { word: "ng", startSec: 156.55, endSec: 156.65, isEmphasis: false },
      { word: "panahon", startSec: 156.65, endSec: 157.35, isEmphasis: true },
    ],
  },
  "c2-7": {
    id: "c2-7",
    orientation: "diagonal-up",
    words: [
      { word: "Sa", startSec: 160.25, endSec: 160.45, isEmphasis: false },
      { word: "tibay", startSec: 160.45, endSec: 160.85, isEmphasis: true },
      { word: "ng", startSec: 160.85, endSec: 160.95, isEmphasis: false },
      { word: "bahay", startSec: 160.95, endSec: 161.45, isEmphasis: true },
      { word: "na", startSec: 161.45, endSec: 161.65, isEmphasis: false },
      { word: "titirhan", startSec: 161.65, endSec: 162.35, isEmphasis: true },
      { word: "n'yo", startSec: 162.35, endSec: 162.75, isEmphasis: true },
    ],
  },
  "c2-8": {
    id: "c2-8",
    orientation: "vertical-stack",
    words: [
      { word: "Gigibain", startSec: 166.05, endSec: 166.85, isEmphasis: true },
      { word: "ko", startSec: 166.85, endSec: 167.05, isEmphasis: false },
      { word: "mga", startSec: 167.05, endSec: 167.25, isEmphasis: false },
      { word: "pader", startSec: 167.25, endSec: 167.75, isEmphasis: true },
      { word: "n'yo", startSec: 167.75, endSec: 168.15, isEmphasis: true },
    ],
  },
  "c2-9": {
    id: "c2-9",
    orientation: "monolith-center",
    words: [
      { word: "Dahil", startSec: 170.97, endSec: 171.27, isEmphasis: false },
      { word: "ako,", startSec: 171.27, endSec: 171.57, isEmphasis: true },
      { word: "ako", startSec: 171.97, endSec: 172.27, isEmphasis: true },
      { word: "ang", startSec: 172.27, endSec: 172.47, isEmphasis: false },
      { word: "bagyo", startSec: 172.47, endSec: 173.07, isEmphasis: true },
    ],
  },
  "b-1": {
    id: "b-1",
    orientation: "horizontal",
    words: [
      { word: "Lahat", startSec: 185.81, endSec: 186.17, isEmphasis: false },
      { word: "ng", startSec: 186.17, endSec: 186.30, isEmphasis: false },
      { word: "hahawakan", startSec: 186.30, endSec: 187.08, isEmphasis: false },
      { word: "ko", startSec: 187.08, endSec: 187.29, isEmphasis: false },
    ],
  },
  "b-2": {
    id: "b-2",
    orientation: "horizontal",
    words: [
      { word: "Lagi", startSec: 188.08, endSec: 188.42, isEmphasis: false },
      { word: "sa", startSec: 188.42, endSec: 188.58, isEmphasis: false },
      { word: "'kin", startSec: 188.58, endSec: 188.85, isEmphasis: false },
      { word: "na", startSec: 188.85, endSec: 189.00, isEmphasis: false },
      { word: "lumalayo", startSec: 189.00, endSec: 189.75, isEmphasis: false },
    ],
  },
  "b-3": {
    id: "b-3",
    orientation: "horizontal",
    words: [
      { word: "Lahat", startSec: 190.88, endSec: 191.25, isEmphasis: false },
      { word: "ng", startSec: 191.25, endSec: 191.38, isEmphasis: false },
      { word: "tao", startSec: 191.38, endSec: 191.70, isEmphasis: false },
      { word: "na", startSec: 191.70, endSec: 191.85, isEmphasis: false },
      { word: "nariyan", startSec: 191.85, endSec: 192.45, isEmphasis: false },
    ],
  },
  "b-4": {
    id: "b-4",
    orientation: "diagonal-down",
    words: [
      { word: "Sa", startSec: 194.12, endSec: 194.25, isEmphasis: false },
      { word: "tuwing", startSec: 194.25, endSec: 194.55, isEmphasis: false },
      { word: "lalapit", startSec: 194.55, endSec: 195.05, isEmphasis: false },
      { word: "ay", startSec: 195.05, endSec: 195.15, isEmphasis: false },
      { word: "nasasaktan", startSec: 195.15, endSec: 195.95, isEmphasis: true },
    ],
  },
  "b-5": {
    id: "b-5",
    orientation: "horizontal",
    words: [
      { word: "At", startSec: 197.00, endSec: 197.15, isEmphasis: false },
      { word: "'pag", startSec: 197.15, endSec: 197.35, isEmphasis: false },
      { word: "nagsawa", startSec: 197.35, endSec: 197.85, isEmphasis: false },
      { word: "na", startSec: 197.85, endSec: 197.95, isEmphasis: false },
      { word: "sila", startSec: 197.95, endSec: 198.25, isEmphasis: false },
      { word: "sa", startSec: 198.25, endSec: 198.35, isEmphasis: false },
      { word: "akin", startSec: 198.35, endSec: 198.75, isEmphasis: false },
    ],
  },
  "b-6": {
    id: "b-6",
    orientation: "horizontal",
    words: [
      { word: "'Pag", startSec: 199.92, endSec: 200.15, isEmphasis: false },
      { word: "wala", startSec: 200.15, endSec: 200.45, isEmphasis: false },
      { word: "na", startSec: 200.45, endSec: 200.55, isEmphasis: false },
      { word: "sa", startSec: 200.55, endSec: 200.65, isEmphasis: false },
      { word: "'kin", startSec: 200.65, endSec: 200.90, isEmphasis: false },
      { word: "na", startSec: 200.90, endSec: 201.00, isEmphasis: false },
      { word: "nakatingin", startSec: 201.00, endSec: 201.75, isEmphasis: false },
    ],
  },
  "b-7": {
    id: "b-7",
    orientation: "diagonal-down",
    words: [
      { word: "'Pag", startSec: 203.35, endSec: 203.55, isEmphasis: false },
      { word: "hindi", startSec: 203.55, endSec: 203.85, isEmphasis: false },
      { word: "na", startSec: 203.85, endSec: 203.95, isEmphasis: false },
      { word: "'ko", startSec: 203.95, endSec: 204.15, isEmphasis: false },
      { word: "nakakatawa", startSec: 204.15, endSec: 204.85, isEmphasis: true },
    ],
  },
  "b-8": {
    id: "b-8",
    orientation: "vertical-stack",
    words: [
      { word: "Ako", startSec: 205.64, endSec: 205.90, isEmphasis: false },
      { word: "'yung", startSec: 205.90, endSec: 206.05, isEmphasis: false },
      { word: "laging", startSec: 206.05, endSec: 206.35, isEmphasis: false },
      { word: "naiiwang", startSec: 206.35, endSec: 206.90, isEmphasis: false },
      { word: "mag-isa", startSec: 206.90, endSec: 207.45, isEmphasis: true },
    ],
  },
  "b-9": {
    id: "b-9",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-10": {
    id: "b-10",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-11": {
    id: "b-11",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-12": {
    id: "b-12",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-13": {
    id: "b-13",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-14": {
    id: "b-14",
    orientation: "horizontal",
    words: [
    ],
  },
  "b-15": {
    id: "b-15",
    orientation: "diagonal-down",
    words: [
    ],
  },
  "o-1": {
    id: "o-1",
    orientation: "monolith-center",
    words: [
    ],
  },
  "o-2": {
    id: "o-2",
    orientation: "diagonal-down",
    words: [
      { word: "Kulimlim", startSec: 248.60, endSec: 249.20, isEmphasis: true },
      { word: "ng", startSec: 249.20, endSec: 249.30, isEmphasis: false },
      { word: "langit", startSec: 249.30, endSec: 249.80, isEmphasis: true },
      { word: "sa", startSec: 250.00, endSec: 250.15, isEmphasis: false },
      { word: "inyong", startSec: 250.15, endSec: 250.50, isEmphasis: false },
      { word: "dalawa", startSec: 250.50, endSec: 251.10, isEmphasis: true },
    ],
  },
  "o-3": {
    id: "o-3",
    orientation: "vertical-stack",
    words: [
      { word: "Bulong", startSec: 254.10, endSec: 254.55, isEmphasis: true },
      { word: "ko", startSec: 254.55, endSec: 254.70, isEmphasis: false },
      { word: "sa", startSec: 254.70, endSec: 254.85, isEmphasis: false },
      { word: "hangin", startSec: 254.85, endSec: 255.35, isEmphasis: true },
    ],
  },
  "o-4": {
    id: "o-4",
    orientation: "diagonal-up",
    words: [
      { word: "Sa", startSec: 259.80, endSec: 259.95, isEmphasis: false },
      { word: "tibay", startSec: 259.95, endSec: 260.35, isEmphasis: true },
      { word: "ng", startSec: 260.35, endSec: 260.45, isEmphasis: false },
      { word: "bahay", startSec: 260.45, endSec: 260.85, isEmphasis: true },
      { word: "na", startSec: 260.85, endSec: 260.95, isEmphasis: false },
      { word: "titirhan", startSec: 260.95, endSec: 261.50, isEmphasis: true },
      { word: "n'yo", startSec: 261.50, endSec: 261.75, isEmphasis: false },
    ],
  },
  "o-5": {
    id: "o-5",
    orientation: "vertical-stack",
    words: [
      { word: "Tatangayin", startSec: 265.45, endSec: 266.15, isEmphasis: true },
      { word: "ko", startSec: 266.15, endSec: 266.30, isEmphasis: false },
      { word: "bawat", startSec: 266.30, endSec: 266.65, isEmphasis: false },
      { word: "yero", startSec: 266.65, endSec: 267.15, isEmphasis: true },
    ],
  },
  "o-6": {
    id: "o-6",
    orientation: "monolith-center",
    words: [
      { word: "Dahil", startSec: 270.00, endSec: 270.35, isEmphasis: false },
      { word: "ako", startSec: 270.35, endSec: 270.75, isEmphasis: true },
      { word: "ako", startSec: 270.95, endSec: 271.35, isEmphasis: true },
      { word: "ang", startSec: 271.35, endSec: 271.50, isEmphasis: false },
      { word: "bagyo", startSec: 271.50, endSec: 272.20, isEmphasis: true },
    ],
  },
};
