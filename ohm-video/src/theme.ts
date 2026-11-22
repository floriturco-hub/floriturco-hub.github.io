import { loadFont } from "@remotion/fonts";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Valores medidos en la referencia (ver estilo.md)
export const C = {
  bg: "#0B091D",
  bgDeep: "#01000F",
  white: "#E8E6F0",
  grey: "#8C88A8",
  yellow: "#F8C848",
  cyan: "#08D8E8",
  red: "#E8414F",
  orange: "#E8703C",
  purple: "#582888",
  purpleLight: "#8A5CC8",
  wire: "#3A3360",
  pill: "rgba(8, 7, 22, 0.85)",
  card: "rgba(11, 9, 29, 0.92)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

// Fuentes locales (public/fonts): el render no depende de Google Fonts
export const mono = "JetBrains Mono";
export const montserrat = "Montserrat";

loadFont({ family: mono, url: staticFile("fonts/jetbrains-mono-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: mono, url: staticFile("fonts/jetbrains-mono-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: montserrat, url: staticFile("fonts/montserrat-latin-400-normal.woff2"), weight: "400" });

export const W = 1080;
export const H = 1920;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Tiempo absoluto (segundos de la narración) dentro de una <Sequence> que empieza en t0
export const useT = (t0: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return t0 + frame / fps;
};
