import { Easing, interpolate } from "remotion";
import { GraficaIV } from "../components/GraficaIV";
import { C, clamp, H, mono, useT, W } from "../theme";

// Mismos instantes de choque para los dos casos: el tiempo entre choques no depende del empuje
const T_INI = 36.4;
const LIBRES = [0.7, 0.55, 0.8, 0.6, 0.75, 0.65, 0.7, 0.6, 0.75, 0.7];
const PAUSA = 0.1;
const CHOQUES = (() => {
  const lista: { S: number; C: number }[] = [];
  let s = T_INI;
  for (const libre of LIBRES) {
    lista.push({ S: s, C: s + libre });
    s += libre + PAUSA;
  }
  return lista;
})();
const MEDIA = (() => {
  const total = CHOQUES[CHOQUES.length - 1].C + PAUSA - T_INI;
  return LIBRES.reduce((a, l) => a + (l * l) / 2, 0) / total;
})();

const vel = (t: number, empuje: number) => {
  for (const c of CHOQUES) {
    if (t >= c.S && t <= c.C) {
      return empuje * (t - c.S);
    }
  }
  return 0;
};

const Tarjeta: React.FC<{
  readonly t: number;
  readonly y: number;
  readonly empuje: number;
  readonly titulo: string;
  readonly color: string;
}> = ({ t, y, empuje, titulo, color }) => {
  const x0 = 120;
  const x1 = 960;
  const yBase = y + 420;
  const escala = 230;
  const tFin = 42.4;
  const mapX = (tt: number) => x0 + ((tt - T_INI) / (tFin - T_INI)) * (x1 - x0);
  const pts: string[] = [];
  for (let tt = T_INI; tt <= Math.min(t, tFin); tt += 1 / 60) {
    pts.push(`${mapX(tt).toFixed(1)},${(yBase - vel(tt, empuje) * escala).toFixed(1)}`);
  }
  const media = interpolate(t, [38.93, 39.8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const yMedia = yBase - MEDIA * empuje * escala;
  const resalta = interpolate(t, [40.47, 40.8], [0, 1], clamp);
  return (
    <g>
      <rect x={60} y={y} width={960} height={500} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <text x={110} y={y + 64} fill={color} fontFamily={mono} fontSize={40} fontWeight={700}>
        {titulo}
      </text>
      <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={C.grey} strokeWidth={2} opacity={0.5} />
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinejoin="round" />
      {media > 0 ? (
        <line
          x1={x0}
          y1={yMedia}
          x2={x0 + (x1 - x0) * media}
          y2={yMedia}
          stroke={C.yellow}
          strokeWidth={5 + 4 * resalta}
          strokeDasharray="18 12"
        />
      ) : null}
      <text x={x1} y={yMedia - 18} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={32} fontWeight={700} opacity={resalta}>
        deriva ×{empuje}
      </text>
    </g>
  );
};

export const Clave: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tarjetas = interpolate(t, [35.15, 35.6, 42.3, 42.7], [0, 1, 1, 0], clamp);
  const iv = interpolate(t, [42.5, 42.9], [0, 1], clamp);
  const zoom = interpolate(t, [35.1, 42.4], [1, 1.04]);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g opacity={tarjetas} transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <Tarjeta t={t} y={330} empuje={1} titulo="empuje ×1" color={C.white} />
        <Tarjeta t={t} y={900} empuje={2} titulo="empuje ×2" color={C.yellow} />
      </g>
      <GraficaIV
        x={60}
        y={480}
        ancho={960}
        alto={900}
        trazo={interpolate(t, [42.9, 43.9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })}
        curva={0}
        puntos={interpolate(t, [42.9, 43.2, 43.5], [0, 1, 2], clamp)}
        opacidad={iv}
      />
    </svg>
  );
};
