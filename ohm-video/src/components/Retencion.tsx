import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mono } from "../theme";

// Piezas de retención (estilo.md §10): subtítulos palabra a palabra arriba y barra de progreso.
// Desde el 2026-11-12 los videos nuevos van SIN logo final (terminan con la narración y empalman con el gancho);
// COLA_CORTA solo la usa detector-mentiras.
// Adaptado de components/Short.tsx de la otra rama al formato de guion/<tema>/narracion.json de esta: words[] = {w, s, e}.
export const COLA_CORTA = 4;

export type PalabraWh = { readonly w: string; readonly s: number; readonly e: number };

// Subtítulos en grupos de 3 palabras, la activa en amarillo, en la franja superior (y ≈ 230-330)
export const Subtitulos: React.FC<{ readonly palabras: readonly PalabraWh[]; readonly fin: number }> = ({ palabras, fin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t > fin + 0.3) {
    return null;
  }
  const i = palabras.findIndex((p, k) => t >= p.s && (k === palabras.length - 1 || t < palabras[k + 1].s));
  if (i < 0) {
    return null;
  }
  const g0 = i - (i % 3);
  const grupo = palabras.slice(g0, g0 + 3);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 230 }}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 64, width: 960, lineHeight: 1.15, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 30 }}>
        {grupo.map((p, k) => {
          const activa = g0 + k === i;
          return (
            <span
              key={k}
              style={{
                color: activa ? C.yellow : C.white,
                textShadow: "0 4px 0 #000, 0 0 18px #000",
                display: "inline-block",
                transform: `scale(${activa ? 1.12 : 1})`,
              }}
            >
              {p.w.trim().toUpperCase()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Barra de progreso amarilla arriba: anima a llegar al final
export const Progreso: React.FC<{ readonly fin: number }> = ({ fin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = Math.min(1, frame / fps / fin);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${u * 100}%`, background: C.yellow, opacity: 0.85 }} />
    </AbsoluteFill>
  );
};
