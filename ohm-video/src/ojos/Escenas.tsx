import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Cara, Celular, FiltrosOjo, Foto, Gato, OjoCorte, OjoFrente } from "./Piezas";

// Instantes clave (s) de public/audio/ojos/narracion.wav (voz x1,0: ya sale a ~190 ppm), sacados con Whisper
export const T = {
  filtro: 2.68,
  fondo: 3.92,
  noche: 5.72,
  abre: 7.04,
  entonces: 9.8,
  flash: 10.56,
  dura: 11.84,
  entra: 14.34,
  ahi: 17.34,
  capa: 19.36,
  coroides: 21.38,
  rebota: 22.64,
  objetivo: 25.8,
  junto: 27.22,
  roja: 28.42,
  porEso: 31.06,
  destello: 32.72,
  cierra: 34.54,
  gato: 38.0,
  espejo: 40.88,
  dato: 44.6,
  blanco: 45.8,
  soloOjo: 46.78,
  oftalmologo: 49.16,
  final: 51.4,
  porDentro: 53.56,
  fin: 54.95,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cx?: number; readonly cy?: number }> = ({ children, zoom = 1, cx = 540, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <FiltrosOjo />
    <g transform={`translate(${cx - cx * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const Destello: React.FC<{ readonly t: number; readonly en: number; readonly fuerza?: number }> = ({ t, en, fuerza = 0.7 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FFF6E0", opacity: interpolate(t, [en, en + 0.05, en + 0.45], [0, fuerza, 0], clamp) }} />
);

// Rayo en tramos rectos que se dibuja según el progreso
const Rayo: React.FC<{ readonly puntos: [number, number][]; readonly p: number; readonly color: string; readonly ancho?: number; readonly brillo?: boolean }> = ({ puntos, p, color, ancho = 10, brillo = false }) => {
  if (p <= 0) return null;
  const tramos = puntos.slice(1).map((pt, i) => Math.hypot(pt[0] - puntos[i][0], pt[1] - puntos[i][1]));
  const total = tramos.reduce((a, b) => a + b, 0);
  const d = `M ${puntos.map((pt) => pt.join(" ")).join(" L ")}`;
  return (
    <g>
      {brillo ? <path d={d} stroke={color} strokeWidth={ancho * 3} fill="none" opacity={0.35} filter="url(#brillo-ojo)" strokeDasharray={total} strokeDashoffset={total * (1 - p)} /> : null}
      <path d={d} stroke={color} strokeWidth={ancho} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={total} strokeDashoffset={total * (1 - p)} />
    </g>
  );
};

// Geometría compartida por las escenas del corte del ojo
const CEL = { x: 170, y: 760, s: 1.1 };
const OJO = { x: 690, y: 760, s: 0.95 };
const FLASH: [number, number] = [CEL.x + 40 * CEL.s, CEL.y - 60 * CEL.s];
const LENTE: [number, number] = [CEL.x + 40 * CEL.s, CEL.y + 10 * CEL.s];
const PUPILA: [number, number] = [OJO.x - 254 * OJO.s, OJO.y];
const FONDO: [number, number] = [OJO.x + 262 * OJO.s, OJO.y + 20];
const ENTRA: [number, number][] = [FLASH, [PUPILA[0], PUPILA[1] - 8], FONDO];
const VUELVE: [number, number][] = [FONDO, [PUPILA[0], PUPILA[1] + 8], LENTE];

// A. Gancho: la foto con flash
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = interpolate(t, [T.filtro, T.fondo + 0.8], [1, 2.6], suave);
  return (
    <>
      <Lienzo zoom={zoom} cx={540} cy={820 - 20 * 1.3}>
        <Foto x={180} y={340} w={720} h={900} id="gancho" pie="foto con flash">
          <Cara x={540} y={820} s={1.3} reflejoIzq={C.red} reflejoDer={C.red} intensidad={interpolate(t, [0.05, 0.4], [0, 1], clamp)} />
        </Foto>
      </Lienzo>
      <Destello t={t} en={0.03} fuerza={0.8} />
    </>
  );
};

// B. De noche, la pupila se abre al máximo
export const PupilaNoche: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pupila = interpolate(t, [T.noche + 0.6, T.abre + 1.0], [0.1, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.noche, T.entonces], [1, 1.05])}>
      <g opacity={aparece(t, T.noche)}>
        <circle cx={820} cy={330} r={70} fill="#F4ECC8" />
        <circle cx={850} cy={310} r={62} fill={C.bg} />
      </g>
      <OjoFrente x={540} y={900} s={3.4} pupila={pupila} />
      <g opacity={aparece(t, T.abre)}>
        <line x1={540 - (14 + 34 * pupila) * 3.4} y1={1180} x2={540 + (14 + 34 * pupila) * 3.4} y2={1180} stroke={C.cyan} strokeWidth={6} />
        <line x1={540 - (14 + 34 * pupila) * 3.4} y1={1160} x2={540 - (14 + 34 * pupila) * 3.4} y2={1200} stroke={C.cyan} strokeWidth={6} />
        <line x1={540 + (14 + 34 * pupila) * 3.4} y1={1160} x2={540 + (14 + 34 * pupila) * 3.4} y2={1200} stroke={C.cyan} strokeWidth={6} />
        <text x={540} y={1250} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={34} fontWeight={700}>pupila</text>
      </g>
    </Lienzo>
  );
};

// Escenario del corte: celular a la izquierda, ojo a la derecha
const Corte: React.FC<{ readonly t: number; readonly destello?: number; readonly entra?: number; readonly vuelve?: number; readonly coroides?: number; readonly etiquetas?: number; readonly lente?: number }> = ({
  t,
  destello = 0,
  entra = 0,
  vuelve = 0,
  coroides = 0,
  etiquetas = 0,
  lente = 0,
}) => (
  <g>
    <OjoCorte x={OJO.x} y={OJO.y} s={OJO.s} pupila={1} coroides={coroides} etiquetas={etiquetas} />
    <Rayo puntos={ENTRA} p={entra} color="#FFF6D0" ancho={9} />
    <Rayo puntos={VUELVE} p={vuelve} color={C.red} ancho={10} brillo />
    <Celular x={CEL.x} y={CEL.y} s={CEL.s} destello={destello} />
    {lente > 0 ? (
      <g opacity={lente}>
        <circle cx={LENTE[0]} cy={LENTE[1]} r={52} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="10 8" transform={`rotate(${t * 40} ${LENTE[0]} ${LENTE[1]})`} />
        <text x={CEL.x} y={CEL.y + 250} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700}>objetivo</text>
        <text x={CEL.x} y={CEL.y - 230} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>flash</text>
      </g>
    ) : null}
  </g>
);

// C. El flash es más rápido que la pupila
export const Flash: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const destello = interpolate(t, [T.flash, T.flash + 0.05, T.flash + 0.6], [0, 1, 0], clamp);
  const barras = interpolate(t, [T.dura, T.dura + 1.4], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.entonces, T.ahi], [1, 1.04])}>
        <Corte t={t} destello={destello} entra={interpolate(t, [T.entra, T.entra + 1.6], [0, 1], suave)} />
        <g opacity={aparece(t, T.dura)}>
          <rect x={80} y={1170} width={920} height={250} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={120} y={1235} fill={C.grey} fontFamily={mono} fontSize={30}>cuánto tarda</text>
          <text x={120} y={1300} fill={C.yellow} fontFamily={mono} fontSize={32} fontWeight={700}>flash</text>
          <rect x={360} y={1276} width={Math.max(4, 14 * barras)} height={30} rx={6} fill={C.yellow} />
          <text x={120} y={1375} fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>tu pupila</text>
          <rect x={360} y={1351} width={Math.max(4, 590 * barras)} height={30} rx={6} fill={C.cyan} />
        </g>
      </Lienzo>
      <Destello t={t} en={T.flash} fuerza={0.35} />
    </>
  );
};

// D. La coroides devuelve la luz roja hacia el objetivo
export const Coroides: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const coroides = interpolate(t, [T.capa, T.capa + 0.6, T.rebota, T.roja, T.roja + 0.6], [0, 1, 0.6, 0.6, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.porEso], [1, 1.06])} cx={540} cy={760}>
      <Corte t={t} entra={1} vuelve={interpolate(t, [T.rebota + 0.3, T.objetivo + 0.4], [0, 1], suave)} coroides={coroides} etiquetas={aparece(t, T.ahi + 0.4)} lente={aparece(t, T.junto)} />
      <g opacity={aparece(t, T.roja)}>
        <Foto x={680} y={1200} w={300} h={220} id="mini">
          <Cara x={830} y={1330} s={0.55} reflejoIzq={C.red} reflejoDer={C.red} />
        </Foto>
      </g>
    </Lienzo>
  );
};

// E. El destello previo cierra la pupila
export const DestelloPrevio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const previo = interpolate(t, [T.destello, T.destello + 0.05, T.destello + 0.5], [0, 0.7, 0], clamp);
  const foto = interpolate(t, [T.destello + 1.1, T.destello + 1.15, T.destello + 1.6], [0, 1, 0], clamp);
  const pupila = interpolate(t, [T.destello + 0.1, T.cierra + 0.4], [0.8, 0.15], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.porEso, T.gato], [1, 1.04])}>
        <Celular x={540} y={430} s={0.9} destello={Math.max(previo, foto)} />
        <text x={540} y={640} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30} opacity={aparece(t, T.destello)}>
          {t < T.destello + 1.1 ? "destello previo" : "foto"}
        </text>
        <g opacity={aparece(t, T.porEso)}>
          <Foto x={80} y={760} w={400} h={460} id="sin" pie="sin destello">
            <Cara x={280} y={1010} s={0.72} reflejoIzq={C.red} reflejoDer={C.red} />
          </Foto>
        </g>
        <g opacity={aparece(t, T.destello)}>
          <Foto x={600} y={760} w={400} h={460} id="con" pie="con destello">
            <Cara x={800} y={1010} s={0.72} pupila={pupila} reflejoIzq={C.red} reflejoDer={C.red} intensidad={interpolate(t, [T.cierra, T.cierra + 0.8], [0.9, 0.08], clamp)} />
          </Foto>
        </g>
      </Lienzo>
      <Destello t={t} en={T.destello + 1.1} fuerza={0.25} />
    </>
  );
};

// F. Los ojos del gato: una capa espejo detrás de la retina
export const OjosGato: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gato, T.dato], [1, 1.06])}>
      <Gato x={540} y={900} s={1.55} brillo={interpolate(t, [T.gato + 0.3, T.gato + 0.9], [0, 1], clamp) * (0.85 + 0.15 * Math.sin(t * 5))} />
      <text x={540} y={1330} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} opacity={aparece(t, T.espejo + 0.8)}>
        tapetum lucidum
      </text>
    </Lienzo>
  );
};

// G. Dato útil: un solo ojo blanco
export const OjoBlanco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const aro = aparece(t, T.soloOjo);
  return (
    <Lienzo zoom={interpolate(t, [T.dato, T.final], [1, 1.06])}>
      <Foto x={180} y={340} w={720} h={900} id="blanco">
        <Cara x={540} y={820} s={1.3} reflejoIzq={C.red} reflejoDer={t > T.blanco ? "#F4F0D8" : C.red} />
      </Foto>
      <g opacity={aro}>
        <circle cx={540 + 88 * 1.3} cy={820 - 20 * 1.3} r={80} fill="none" stroke={C.yellow} strokeWidth={7} strokeDasharray="14 10" transform={`rotate(${t * 30} ${540 + 88 * 1.3} ${820 - 20 * 1.3})`} />
      </g>
    </Lienzo>
  );
};

// H. Cierre: es tu ojo por dentro
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.final, T.fin + 0.5], [1, 1.08])}>
      <OjoCorte x={540} y={860} s={1.2} pupila={1} coroides={0.6 + 0.4 * Math.sin(t * 3)} etiquetas={0} />
    </Lienzo>
  );
};
