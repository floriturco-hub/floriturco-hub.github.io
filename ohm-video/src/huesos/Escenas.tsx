import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { CalcioSangre, Casco, Esqueleto, GraficaPerdida, HuesoLargo, Remodelado } from "./Piezas";

// Instantes clave (s) de public/audio/huesos/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  cambiado: 3.68,
  vivos: 6.46,
  dos: 8.44,
  osteoclastos: 11.0,
  disuelven: 14.26,
  osteoblastos: 16.38,
  rellenan: 19.72,
  ciclo: 22.56,
  cada: 25.9,
  diez: 27.66,
  para: 29.52,
  reparar: 31.1,
  adaptarse: 34.44,
  carga: 35.58,
  adelgaza: 37.92,
  astronautas: 39.68,
  pierden: 41.82,
  ademas: 44.76,
  calcio: 46.2,
  sangre: 48.38,
  asi: 50.26,
  muevete: 50.78,
  construye: 51.56,
  fin: 53.8,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// A. Gancho: hace 10 años y hoy
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const flash = interpolate(t, [T.cambiado, T.cambiado + 0.08, T.cambiado + 0.45], [0, 0.25, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.vivos], [1, 1.05])}>
        <Esqueleto x={290} y={760} s={0.72} color="#8C88A8" op={0.6} />
        <Esqueleto x={790} y={760} s={0.72} brillo={aparece(t, T.cambiado)} t={t} />
        <text x={290} y={1300} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>hace 10 años</text>
        <text x={790} y={1300} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>hoy</text>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. Tus huesos están vivos
export const Vivo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vivos, T.osteoclastos], [1, 1.06])}>
      <HuesoLargo x={540} y={760} s={1.6} corte />
      <g opacity={aparece(t, T.dos)}>
        <circle cx={380} cy={1120} r={50} fill="#A85CC8" />
        <circle cx={700} cy={1120} r={30} fill={C.cyan} />
        <text x={380} y={1220} textAnchor="middle" fill="#C89AE8" fontFamily={mono} fontSize={30} fontWeight={700}>demoledoras</text>
        <text x={700} y={1220} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>constructoras</text>
      </g>
    </Lienzo>
  );
};

// C. Excavar y rellenar
export const Ciclo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.osteoclastos, T.ciclo], [1, 1.04])}>
      <Remodelado x={90} y={760} w={900} t={t} excava={interpolate(t, [T.osteoclastos + 0.4, T.osteoblastos - 0.4], [0, 1], clamp)} rellena={interpolate(t, [T.osteoblastos, T.ciclo - 0.6], [0, 1], clamp)} />
    </Lienzo>
  );
};

// D. Un 10 % al año
export const Renueva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pct = Math.round(interpolate(t, [T.cada, T.diez + 0.4], [0, 10], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.ciclo, T.para], [1, 1.04])}>
      <Esqueleto x={540} y={700} s={0.8} brillo={1} t={t} />
      <g opacity={aparece(t, T.cada)}>
        <rect x={190} y={1250} width={700} height={50} rx={25} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <rect x={194} y={1254} width={692 * (pct / 100) * 5} height={42} rx={21} fill={C.yellow} />
        <text x={540} y={1390} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={64} fontWeight={700}>{pct} % al año</text>
      </g>
    </Lienzo>
  );
};

// E. Para qué: reparar y adaptarse
export const ParaQue: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const grieta = 1 - interpolate(t, [T.reparar + 1.2, T.adaptarse], [0, 1], clamp);
  const grosor = t < T.adelgaza ? interpolate(t, [T.carga, T.carga + 0.8], [1, 1.45], clamp) : interpolate(t, [T.adelgaza, T.adelgaza + 0.8], [1.45, 0.65], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.para, T.astronautas], [1, 1.04])}>
      <HuesoLargo x={540} y={820} s={1.6} grosor={grosor} />
      {t > T.reparar && t < T.adaptarse + 0.5 ? (
        <path d="M 470 770 L 500 800 L 480 830 L 520 860" stroke={C.red} strokeWidth={8} fill="none" opacity={grieta * aparece(t, T.reparar)} />
      ) : null}
      {t > T.carga && t < T.adelgaza ? (
        <g opacity={aparece(t, T.carga)}>
          <rect x={440} y={540} width={200} height={90} rx={14} fill="#5A5478" />
          <text x={540} y={600} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>carga</text>
          <path d="M 540 640 L 540 700 M 515 680 L 540 705 L 565 680" stroke={C.white} strokeWidth={8} fill="none" />
        </g>
      ) : null}
    </Lienzo>
  );
};

// F. Astronautas
export const Astronautas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.astronautas, T.ademas], [1, 1.04])}>
      <Casco x={540} y={500} s={1.3} />
      <g opacity={aparece(t, T.pierden - 0.4)}>
        <GraficaPerdida x={120} y={900} w={840} h={420} p={interpolate(t, [T.pierden, T.ademas - 0.3], [0, 1], clamp)} />
      </g>
    </Lienzo>
  );
};

// G. Reserva de calcio
export const Calcio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ademas, T.asi], [1, 1.04])}>
      <HuesoLargo x={540} y={1180} s={1.4} corte />
      <g opacity={aparece(t, T.sangre - 0.3)}>
        <CalcioSangre x={540} y={700} t={t} p={1} />
        <text x={540} y={590} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={32} fontWeight={700}>sangre</text>
      </g>
    </Lienzo>
  );
};

// H. Cierre: muévete
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salto = Math.abs(Math.sin(t * 4)) * 40 * aparece(t, T.muevete);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.06])}>
      <Esqueleto x={540} y={760 - salto} s={0.85} brillo={aparece(t, T.construye)} t={t} />
    </Lienzo>
  );
};
