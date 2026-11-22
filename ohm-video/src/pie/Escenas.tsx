import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { ADN, Dispersion, Mano, Regla, Zapato } from "./Piezas";

// Instantes clave (s) de public/audio/pie/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  pieGrande: 5.58,
  resultado: 7.2,
  ninguna: 8.26,
  saber: 9.58,
  manos: 12.82,
  corea: 15.32,
  indice: 18.04,
  anularLargo: 20.5,
  testosterona: 25.2,
  debil: 29.18,
  sirve: 31.0,
  rumor: 33.96,
  hox: 35.42,
  origen: 41.02,
  cierto: 43.6,
  quince: 44.28,
  trece: 47.84,
  menos: 49.28,
  asi: 50.98,
  no: 52.32,
  fin: 53.8,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// A. Gancho: midieron a 104 hombres
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.round(interpolate(t, [0.2, 3.2], [0, 104], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <Lienzo zoom={interpolate(t, [0, T.resultado], [1, 1.05])}>
      <Zapato x={540} y={470} s={1.6} />
      <text x={540} y={760} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={130} fontWeight={700}>{n}</text>
      <text x={540} y={820} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={32}>hombres medidos</text>
      {new Array(n).fill(0).map((_, k) => (
        <circle key={k} cx={150 + (k % 13) * 60} cy={900 + Math.floor(k / 13) * 56} r={14} fill={C.cyan} opacity={0.8} />
      ))}
      <text x={540} y={1400} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={110} fontWeight={700} opacity={aparece(t, T.pieGrande)}>?</text>
    </Lienzo>
  );
};

// B. Resultado: ninguna relación
export const Resultado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.resultado, T.manos], [1, 1.04])}>
      <Zapato x={540} y={330} s={0.9} />
      <Dispersion x={90} y={500} w={900} h={760} n={60} pendiente={0} ruido={0.9} p={interpolate(t, [T.resultado, T.ninguna], [0, 1], clamp)} ejeX="talla de zapato" ejeY="longitud" semilla="pie" linea={interpolate(t, [T.ninguna, T.ninguna + 0.6], [0, 1], clamp)} />
    </Lienzo>
  );
};

// C. Las manos: índice contra anular
export const Manos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const res = aparece(t, T.indice);
  return (
    <Lienzo zoom={interpolate(t, [T.manos, T.debil], [1, 1.05])}>
      <Mano x={540} y={760} s={1.5} resalte={res} />
      <g opacity={res} fontFamily={mono} fontSize={34} fontWeight={700}>
        <text x={330} y={300} textAnchor="middle" fill={C.cyan}>índice</text>
        <text x={760} y={300} textAnchor="middle" fill={C.yellow}>anular</text>
      </g>
      <g opacity={aparece(t, T.anularLargo)}>
        <line x1={600} y1={360} x2={720} y2={360} stroke={C.yellow} strokeWidth={5} strokeDasharray="10 8" />
        <text x={540} y={1180} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700}>anular más largo</text>
      </g>
      <g opacity={aparece(t, T.corea)}>
        <text x={540} y={1290} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>Corea · 144 hombres</text>
      </g>
    </Lienzo>
  );
};

// D. Relación débil
export const Debil: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.debil, T.rumor], [1, 1.04])}>
      <Dispersion x={90} y={420} w={900} h={820} n={70} pendiente={0.35} ruido={0.85} p={interpolate(t, [T.debil, T.debil + 1], [0, 1], clamp)} ejeX="anular / índice" ejeY="longitud" semilla="mano" linea={interpolate(t, [T.debil + 0.8, T.debil + 1.6], [0, 1], clamp)} />
    </Lienzo>
  );
};

// E. Genes Hox: mismo origen
export const Hox: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.rumor, T.cierto], [1, 1.04])}>
      <ADN x={540} y={300} h={640} t={t} />
      <g opacity={aparece(t, T.hox)}>
        <text x={540} y={1030} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={48} fontWeight={700}>genes Hox</text>
        <Mano x={300} y={1260} s={0.45} resalte={0} />
        <Zapato x={790} y={1260} s={0.6} />
        <path d="M 480 1060 L 330 1140 M 600 1060 L 760 1160" stroke={C.cyan} strokeWidth={5} strokeDasharray="10 8" />
      </g>
    </Lienzo>
  );
};

// F. La media: unos 13 cm
export const Media: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cierto, T.asi], [1, 1.04])}>
      <g opacity={aparece(t, T.quince)}>
        <text x={540} y={430} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={110} fontWeight={700}>+15.000</text>
        <text x={540} y={500} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={32}>hombres analizados</text>
      </g>
      <g opacity={aparece(t, T.trece - 0.4)}>
        <Regla x={90} y={900} w={900} marca={13.1} p={interpolate(t, [T.trece - 0.3, T.trece + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} />
      </g>
    </Lienzo>
  );
};

// G. Cierre: no mires los zapatos
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x = aparece(t, T.no);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.06])}>
      <Zapato x={540} y={820} s={1.8} />
      <g opacity={x} stroke={C.red} strokeWidth={22} strokeLinecap="round">
        <line x1={260} y1={560} x2={820} y2={1080} />
        <line x1={820} y1={560} x2={260} y2={1080} />
      </g>
    </Lienzo>
  );
};
