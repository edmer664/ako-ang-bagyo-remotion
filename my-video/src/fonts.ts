import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

export const montserrat = loadMontserrat("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

export const oswald = loadOswald("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});
