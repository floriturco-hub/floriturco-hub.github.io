import { Easing, interpolate, random } from "remotion";
import { Cara } from "../components/Cara";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Botella } from "./Botella";
import { Espuma } from "./Espuma";
import { T } from "./tiempos";

// Ducha de noche: alguien bajo el agua, una repisa con la esponja y el frasco. Todo depende de la narración.
type P2 = [number, number];
const REPISA = { x: 640, y: 1300, w: 460 };
const ESPONJA: P2 = [740, 1262];
const HOMBRO: P2 = [470, 1070];
const BOTELLA: P2 = [960, 1300];
const CARA: P2 = [330, 780];
const ESCALA_CARA = 1.7;
const NARIZ: P2 = [CARA[0] + 86 * ESCALA_CARA, CARA[1] + 26 * ESCALA_CARA];
const LIMBICO: P2 = [CARA[0] + 10 * ESCALA_CARA, CARA[1] - 10 * ESCALA_CARA];
const PIEL = "#C98A64";
const ESPONJA_COLOR = "#E07AA8";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1080, 1.0],
  [T.parece - 0.3, 560, 1080, 1.02],
  [T.parece + 0.6, 740, 1230, 2.6],
  [T.gel - 0.3, 740, 1230, 2.65],
  [T.gel + 0.6, 620, 1160, 1.3],
  [T.poros - 0.4, 620, 1160, 1.32],
  [T.poros + 0.6, 740, 1240, 4.0],
  [T.curiosidad - 0.3, 740, 1240, 4.1],
  [T.curiosidad + 0.7, 430, 800, 2.0],
  [T.primerPaso - 0.4, 430, 800, 2.05],
  [T.primerPaso + 0.6, 560, 1080, 1.0],
  [T.mio - 0.2, 560, 1080, 1.0],
  [T.mio + 0.6, 840, 1120, 1.6],
  [T.deleita - 0.4, 840, 1120, 1.65],
  [T.deleita + 0.6, 470, 1020, 1.6],
  [T.noMagia - 0.3, 470, 1020, 1.65],
  [T.noMagia + 0.6, 560, 1080, 1.0],
  [T.fin, 560, 1080, 1.03],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const gira = (p: P2, grados: number): P2 => {
  const a = (grados * Math.PI) / 180;
  return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
};

// Gotas de la ducha
const GOTAS = new Array(40).fill(0).map((_, i) => ({ x: 200 + random(`gx${i}`) * 300, fase: random(`gf${i}`), v: 0.6 + random(`gv${i}`) * 0.5 }));
const POROS = new Array(16).fill(0).map((_, i) => ({ x: (random(`px${i}`) - 0.5) * 150, y: (random(`py${i}`) - 0.5) * 70, r: 3 + random(`pr${i}`) * 5 }));

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Bano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;

  // La esponja: se aprieta y se suelta; luego va al hombro y se mueve en círculos
  const apretando = (t > T.aprietas && t < T.curiosidad) || (t > T.aprieta && t < T.extiende + 0.4);
  const aprieto = apretando ? Math.max(0, Math.sin(t * 7)) : 0;
  const alHombro = interpolate(t, [T.deleita - 0.2, T.deleita + 0.6], [0, 1], suave);
  const frota = alHombro > 0.99 ? 1 : 0;
  const ex = ESPONJA[0] + (HOMBRO[0] - ESPONJA[0]) * alHombro + Math.cos(t * 4) * 26 * frota;
  const ey = ESPONJA[1] + (HOMBRO[1] - ESPONJA[1]) * alHombro + Math.sin(t * 4) * 14 * frota - Math.sin(alHombro * Math.PI) * 90;

  // Espuma sobre la esponja y, al final, sobre el hombro
  const espuma = interpolate(t, [0.4, 2.0, T.masAire, T.pocoProducto, T.cremosa, T.cremosa + 1.2], [0, 0.35, 0.4, 0.75, 0.75, 1], clamp);
  const espumaHombro = interpolate(t, [T.deleita + 0.6, T.extiende + 0.8], [0, 1], clamp);

  // Aire que entra por los poros al soltar la esponja
  const aireO = interpolate(t, [T.mete - 0.2, T.mete + 0.3, T.curiosidad - 0.3, T.curiosidad], [0, 1, 1, 0], clamp);

  // Olfato: aroma que sube a la nariz y señal que va directa a la zona de emociones y recuerdos
  const aroma = Math.max(
    interpolate(t, [T.olfato - 0.3, T.olfato + 0.3, T.primerPaso - 0.4, T.primerPaso], [0, 1, 1, 0], clamp),
    interpolate(t, [T.fragancia - 0.2, T.fragancia + 0.4, T.truco - 0.3, T.truco], [0, 1, 1, 0], clamp),
  );
  const via = interpolate(t, [T.directo - 0.2, T.directo + 0.8], [0, 1], suave) * interpolate(t, [T.primerPaso - 0.4, T.primerPaso], [1, 0], clamp);
  const limbico = interpolate(t, [T.emociones - 0.2, T.emociones + 0.4, T.primerPaso - 0.4, T.primerPaso], [0, 1, 1, 0], clamp);
  const sonrie = interpolate(t, [T.humor - 0.1, T.humor + 0.4], [0, 1], clamp);

  // Frasco: se inclina sobre la esponja y deja caer el gel
  const sirve = interpolate(t, [T.palmolive + 0.5, T.palmolive + 1.3, T.esponja + 0.1, T.esponja + 0.8], [0, 1, 1, 0], suave);
  // Boca abajo sobre la esponja: la base queda arriba y la boca a ~60 px de la espuma
  const bx = BOTELLA[0] + (ESPONJA[0] + 120 - BOTELLA[0]) * sirve;
  const by = BOTELLA[1] + (783 - BOTELLA[1]) * sirve;
  const bGiro = -160 * sirve;
  const boca = gira([0, -334 * 1.05], bGiro);
  const gota = interpolate(t, [T.palmolive + 1.4, T.esponja], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const gotaO = t > T.palmolive + 1.3 && t < T.esponja + 0.1 ? 1 : 0;

  // Etiquetas
  const tagAgua = interpolate(t, [T.agua, T.agua + 0.4, T.poros - 0.4, T.poros], [0, 1, 1, 0], clamp);
  const tagPoros = interpolate(t, [T.poros + 0.5, T.poros + 0.9, T.mete - 0.2, T.mete], [0, 1, 1, 0], clamp);
  const tagAire = interpolate(t, [T.mete + 0.2, T.mete + 0.6, T.curiosidad - 0.3, T.curiosidad], [0, 1, 1, 0], clamp);
  const tagRecuerdos = interpolate(t, [T.emociones, T.emociones + 0.4, T.primerPaso - 0.4, T.primerPaso], [0, 1, 1, 0], clamp);
  const tagCremosa = interpolate(t, [T.cremosa, T.cremosa + 0.4, T.deleita - 0.4, T.deleita], [0, 1, 1, 0], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="niebla-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Pared de azulejos */}
        <rect x={-400} y={180} width={1900} height={2300} fill="#17132E" />
        {new Array(15).fill(0).map((_, i) => (
          <line key={`v${i}`} x1={-400 + i * 130} y1={180} x2={-400 + i * 130} y2={2480} stroke="#221D40" strokeWidth={4} />
        ))}
        {new Array(18).fill(0).map((_, i) => (
          <line key={`h${i}`} x1={-400} y1={180 + i * 130} x2={1500} y2={180 + i * 130} stroke="#221D40" strokeWidth={4} />
        ))}

        {/* Ducha y agua */}
        <path d="M 120 180 L 120 300 C 120 340, 160 360, 220 370" fill="none" stroke="#8C88A8" strokeWidth={16} strokeLinecap="round" />
        <ellipse cx={260} cy={386} rx={70} ry={22} fill="#C8C4D8" transform="rotate(14 260 386)" />
        {GOTAS.map((g, i) => {
          const p = (t * g.v + g.fase) % 1;
          return <line key={i} x1={g.x} y1={420 + p * 1250} x2={g.x - 4} y2={448 + p * 1250} stroke={C.cyan} strokeWidth={3} strokeLinecap="round" opacity={0.3} />;
        })}

        {/* Persona: hombros y cara (componente común) */}
        <path d="M 262 985 C 200 1010, 120 1040, 96 1130 C 80 1300, 72 1700, 66 2480 L 650 2480 C 646 1700, 646 1300, 640 1140 C 620 1050, 500 1010, 362 985 Z" fill={PIEL} />
        <path d="M 300 1030 C 360 1050, 430 1052, 520 1060" fill="none" stroke="#A86A48" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        <Cara x={CARA[0]} y={CARA[1]} escala={ESCALA_CARA} ojos={1 - 0.85 * sonrie * aroma} />
        {sonrie > 0 ? (
          <path d={`M ${CARA[0] + 66 * ESCALA_CARA} ${CARA[1] + 50 * ESCALA_CARA} q 8 ${6 * sonrie} 16 0`} fill="none" stroke="#8A5236" strokeWidth={3} strokeLinecap="round" opacity={sonrie * aroma} />
        ) : null}

        {/* Vía del olfato: de la nariz a la zona de emociones y recuerdos */}
        {via > 0 ? (
          <g>
            <path
              d={`M ${NARIZ[0] - 6} ${NARIZ[1] - 10} C ${NARIZ[0] - 40} ${NARIZ[1] - 60}, ${LIMBICO[0] + 40} ${LIMBICO[1] + 10}, ${LIMBICO[0]} ${LIMBICO[1]}`}
              fill="none"
              stroke={C.yellow}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - via}
            />
            <circle cx={LIMBICO[0]} cy={LIMBICO[1]} r={22 + 6 * Math.sin(t * 6)} fill={C.yellow} opacity={0.5 * limbico} filter="url(#brillo-sm)" />
            <circle cx={LIMBICO[0]} cy={LIMBICO[1]} r={10} fill={C.yellow} opacity={limbico} />
          </g>
        ) : null}

        {/* Repisa */}
        <rect x={REPISA.x} y={REPISA.y} width={REPISA.w} height={40} rx={8} fill="#3A3360" />
        <rect x={REPISA.x} y={REPISA.y} width={REPISA.w} height={10} rx={5} fill="#5A4A8A" />

        {/* Frasco y gota de gel */}
        <Botella x={bx} y={by} escala={1.05} giro={bGiro} />
        {gotaO > 0 ? (
          <ellipse cx={bx + boca[0] + (ESPONJA[0] - bx - boca[0]) * gota} cy={by + boca[1] + (ESPONJA[1] - 40 - by - boca[1]) * gota} rx={14} ry={20} fill="#9A6AD0" stroke="#C8A8F0" strokeWidth={2} />
        ) : null}

        {/* Espuma sobre el hombro */}
        <Espuma x={HOMBRO[0]} y={HOMBRO[1] + 10} ancho={170} alto={60} cantidad={espumaHombro} semilla="hombro" t={t} />

        {/* Esponja con poros */}
        <g transform={`translate(${ex} ${ey}) scale(${1 + 0.06 * aprieto} ${1 - 0.25 * aprieto})`}>
          <ellipse cx={0} cy={0} rx={92} ry={50} fill={ESPONJA_COLOR} />
          <ellipse cx={-10} cy={-14} rx={70} ry={26} fill="#F09AC0" opacity={0.6} />
          {POROS.map((p, i) => (
            <ellipse key={i} cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.8} fill="#A84A7A" opacity={0.8} />
          ))}
        </g>
        <Espuma x={ex} y={ey - 34 * (1 - 0.25 * aprieto)} ancho={170} alto={70 + 40 * espuma} cantidad={espuma * (1 - 0.6 * espumaHombro)} semilla="esponja" t={t} />

        {/* Aire entrando por los poros */}
        {aireO > 0 ? (
          <g opacity={aireO}>
            {[-60, -20, 20, 60].map((dx, k) => {
              const p = (t * 1.4 + k * 0.25) % 1;
              return (
                <g key={dx}>
                  <line x1={ESPONJA[0] + dx} y1={ESPONJA[1] - 120 + p * 60} x2={ESPONJA[0] + dx} y2={ESPONJA[1] - 80 + p * 60} stroke={C.white} strokeWidth={3} strokeLinecap="round" opacity={1 - p} />
                  <circle cx={ESPONJA[0] + dx} cy={ESPONJA[1] - 74 + p * 60} r={4} fill={C.white} opacity={1 - p} />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* Aroma que sube a la nariz */}
        {aroma > 0 ? (
          <g opacity={aroma} filter="url(#niebla-sm)">
            {[0, 1, 2, 3].map((k) => {
              const p = (t * 0.35 + k / 4) % 1;
              const x0 = alHombro > 0.5 ? HOMBRO[0] : ESPONJA[0];
              const y0 = alHombro > 0.5 ? HOMBRO[1] - 40 : ESPONJA[1] - 90;
              const px = x0 + (NARIZ[0] + 20 - x0) * p + Math.sin(p * 8 + k) * 30;
              const py = y0 + (NARIZ[1] - y0) * p;
              return <circle key={k} cx={px} cy={py} r={26 - 10 * p} fill={k % 2 ? "#B48AE8" : "#F2DC8A"} opacity={0.75 * (1 - p * 0.6)} />;
            })}
          </g>
        ) : null}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={sx(ESPONJA[0])} y={sy(ESPONJA[1] - 60)} dx={-150} dy={-200} texto="agua" color={C.cyan} o={tagAgua} />
      <Tag x={sx(ESPONJA[0] + POROS[0].x)} y={sy(ESPONJA[1] + POROS[0].y)} dx={-120} dy={240} texto="poros" color={C.white} o={tagPoros} />
      <Tag x={sx(ESPONJA[0])} y={sy(ESPONJA[1] - 100)} dx={160} dy={-180} texto="aire nuevo" color={C.white} o={tagAire} />
      <Tag x={sx(LIMBICO[0])} y={sy(LIMBICO[1])} dx={-60} dy={-230} texto="emociones y recuerdos" color={C.yellow} o={tagRecuerdos} />
      <Tag x={sx(ESPONJA[0])} y={sy(ESPONJA[1] - 110)} dx={-100} dy={-200} texto="espuma cremosa" color={C.white} o={tagCremosa} />
    </svg>
  );
};
