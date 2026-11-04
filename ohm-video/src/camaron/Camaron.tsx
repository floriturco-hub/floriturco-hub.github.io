import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, el arrecife con el camarón mantis, un caracol y el vidrio del acuario; en el centro,
// el brazo por dentro (músculo, resorte en silla de montar, pestillo y mazo); a la derecha, la cavitación
// (presión baja, burbuja de vapor, destello) y debajo la gráfica de los dos golpes.
const CM = { x: 470, y: 1150, s: 1.15 };
const CARACOL: [number, number] = [740, 1200];
const VIDRIO_X = 905;
const B = { x0: 1340, x1: 2360, y0: 600, y1: 1460 };
const CV = { x0: 2600, x1: 3600, y0: 600, y1: 1460, impacto: 3330, cy: 1030 };
const G = { x0: 2600, x1: 3600, y0: 1600, y1: 2240, base: 2140 };
const MAZO = "#E85A3A";
const VERDE = "#3AA86A";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 440, 1130, 1.45],
  [T.como - 0.3, 440, 1130, 1.5],
  [T.como + 0.5, 1850, 1030, 1.0],
  [T.mazo - 0.4, 1850, 1030, 1.02],
  [T.mazo + 0.3, 3100, 1030, 1.0],
  [T.dos - 0.3, 3100, 1030, 1.02],
  [T.dos + 0.4, 3100, 1900, 1.0],
  [T.vidrio - 0.4, 3100, 1900, 1.02],
  [T.vidrio + 0.2, 650, 1130, 1.45],
  [T.fin + 2, 650, 1130, 1.52],
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

const BURBUJAS = new Array(16).fill(0).map((_, i) => ({ x: random(`bx${i}`), f: random(`bf${i}`), r: 4 + random(`br${i}`) * 8 }));
const ESQUIRLAS = new Array(10).fill(0).map((_, i) => ({ a: -Math.PI * 0.9 + random(`ea${i}`) * Math.PI * 0.8, v: 80 + random(`ev${i}`) * 120 }));

// Camarón mantis de perfil mirando a la derecha; `brazo` = ángulo del brazo (115 plegado, 0 golpeando)
const Mantis: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brazo: number; readonly t: number }> = ({ x, y, s, brazo, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* Cola en abanico */}
    <path d="M -350 0 L -420 -40 L -430 0 L -420 40 Z" fill="#3A8AE8" />
    <path d="M -352 -6 L -404 -50 M -352 6 L -404 50" stroke="#F8A040" strokeWidth={8} strokeLinecap="round" />
    {/* Abdomen segmentado */}
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <g key={k}>
        <rect x={-350 + k * 50} y={-30 - k * 1.5} width={54} height={60 + k * 3} rx={16} fill={k % 2 === 0 ? VERDE : "#4AC07A"} />
        <path d={`M ${-340 + k * 50} 32 l -6 22 M ${-318 + k * 50} 32 l 4 22`} stroke="#F8A040" strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
    {/* Caparazón y cabeza */}
    <ellipse cx={-10} cy={-6} rx={80} ry={44} fill="#2E9A5A" />
    <ellipse cx={-14} cy={-20} rx={56} ry={14} fill="#5AD08A" opacity={0.5} />
    <ellipse cx={58} cy={-14} rx={26} ry={22} fill="#2E9A5A" />
    {/* Antenas y escamas antenales */}
    <path d={`M 70 -24 C 140 -${90 + Math.sin(t * 3) * 6}, 200 -110, 260 -100`} fill="none" stroke="#F8A040" strokeWidth={3} />
    <path d={`M 66 -20 C 130 -${60 + Math.sin(t * 3 + 1) * 6}, 190 -60, 250 -40`} fill="none" stroke="#F8A040" strokeWidth={3} />
    <ellipse cx={104} cy={-46} rx={26} ry={9} fill="#F8A040" transform="rotate(-20 104 -46)" />
    {/* Ojos con pedúnculo */}
    <path d="M 62 -30 L 74 -78 M 50 -30 L 56 -74" stroke="#2E9A5A" strokeWidth={9} strokeLinecap="round" />
    <ellipse cx={58} cy={-86} rx={11} ry={16} fill="#3A8AE8" />
    <ellipse cx={77} cy={-90} rx={12} ry={17} fill="#3A8AE8" />
    <path d="M 66 -90 L 89 -90" stroke="#F8E848" strokeWidth={4} />
    {/* Patas */}
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${-40 + k * 26} 30 l ${-6 + k * 2} 34`} stroke="#F8A040" strokeWidth={5} strokeLinecap="round" />
    ))}
    {/* Brazo raptor con el mazo */}
    <g transform={`translate(60 30) rotate(${brazo})`}>
      <rect x={-10} y={-14} width={92} height={28} rx={14} fill={MAZO} />
      <rect x={70} y={-12} width={40} height={24} rx={12} fill="#C8402A" />
      <circle cx={118} cy={0} r={20} fill="#F8D848" />
      <circle cx={124} cy={-4} r={8} fill="#FFF4A8" />
    </g>
  </g>
);

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

const Pildora: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly tam?: number }> = ({ x, y, texto, color, o, tam = 50 }) =>
  o > 0 ? (
    <g opacity={o}>
      <rect x={x - (texto.length * tam * 0.62 + 50) / 2} y={y - tam * 0.95} width={texto.length * tam * 0.62 + 50} height={tam * 1.6} rx={20} fill="#1A1430" stroke={color} strokeWidth={4} />
      <text x={x} y={y + tam * 0.3} textAnchor="middle" fill={color} fontFamily={mono} fontSize={tam} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

export const CamaronMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);
  const golpe = (a: number, dur = 0.06, vuelve = 0.5) => interpolate(t, [a - dur, a, a + 0.15, a + vuelve], [0, 1, 1, 0], clamp);

  // Golpes en el arrecife: dos en el gancho, uno a cámara lenta y el del vidrio
  const G1 = 0.35;
  const G2 = 1.35;
  const lento = t >= T.golpe && t < T.como ? interpolate((t - T.golpe) % 2.4, [0.3, 1.2, 1.6, 2.3], [0, 1, 1, 0], clamp) : 0;
  const gVidrio = T.vidrio + 0.3;
  const extiende = Math.max(golpe(G1), golpe(G2), lento, golpe(gVidrio, 0.06, 1.2));
  const brazo = 115 - 115 * extiende;
  const desplaza = interpolate(t, [T.dos, T.dos + 0.1], [0, 230], clamp);
  const mx = CM.x + desplaza;
  const punta: [number, number] = [mx + (60 + 118 * Math.cos((brazo * Math.PI) / 180)) * CM.s, CM.y + (30 + 118 * Math.sin((brazo * Math.PI) / 180)) * CM.s];
  const destello = (a: number) => interpolate(t, [a, a + 0.05, a + 0.35], [0, 1, 0], clamp);
  const flash = Math.max(destello(G1), destello(G2), destello(gVidrio));
  const roto1 = t >= G1 ? 1 : 0;
  const roto2 = interpolate(t, [G2, G2 + 0.6], [0, 1], clamp);
  const caracolO = interpolate(t, [G2 + 0.4, G2 + 0.9], [1, 0], clamp);
  const regla = ventana(T.dedo - 0.1, T.golpe + 0.2);
  const bala = interpolate(t, [T.bala - 0.2, T.bala + 0.6], [0, 1], clamp);
  const velocidad = ventana(T.ochenta, T.como);
  const crono = ventana(T.menos, T.como);
  const grieta = interpolate(t, [gVidrio, gVidrio + 0.25], [0, 1], clamp);

  // Brazo por dentro: el músculo carga el resorte, el pestillo lo sujeta y al soltarlo ¡pum!
  const brazoB = ventana(T.como - 0.2, T.mazo + 0.2, 0.6, 0.6);
  const carga = interpolate(t, [T.carga - 0.3, T.soltar - 0.3], [0, 1], clamp) * (1 - interpolate(t, [T.pum, T.pum + 0.08], [0, 1], clamp));
  const suelta = interpolate(t, [T.pum, T.pum + 0.08], [0, 1], clamp);
  const pestilloAbre = interpolate(t, [T.soltar + 0.3, T.pum - 0.05], [0, 1], clamp);
  const anguloMazo = interpolate(t, [T.carga - 0.3, T.soltar - 0.3], [60, 120], clamp) * (1 - suelta) + -15 * suelta;
  const pumB = destello(T.pum);
  const fibras = 1 - 0.25 * carga;

  // Cavitación
  const cav = ventana(T.mazo - 0.3, T.dos + 0.4, 0.5, 0.5);
  const avance = interpolate(t, [T.mazo + 0.3, T.mazo + 0.5], [0, 1], clamp);
  const mazoX = 2760 + (CV.impacto - 90 - 2760) * avance;
  const presion = ventana(T.presion, T.burbuja + 0.4);
  const hervor = interpolate(t, [T.hierve, T.hierve + 0.8], [0, 1], clamp);
  const crece = interpolate(t, [T.burbuja - 0.4, T.burbuja + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const colapso = interpolate(t, [T.revienta, T.revienta + 0.25], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const radioBurbuja = 95 * crece * colapso;
  const ondas = interpolate(t, [T.revienta + 0.2, T.revienta + 1.4], [0, 1], clamp);
  const luz = interpolate(t, [T.luz - 0.1, T.luz + 0.1, T.miles + 1.2, T.dos], [0, 1, 0.7, 0], clamp);
  const miles = ventana(T.miles, T.dos + 0.3);

  // Gráfica de los dos golpes
  const grafica = ventana(T.dos - 0.2, T.vidrio + 0.2, 0.6, 0.5);
  const pico1 = interpolate(t, [T.mazo2 - 0.2, T.mazo2 + 0.2], [0, 1], clamp);
  const pico2 = interpolate(t, [T.burbuja2 - 0.2, T.burbuja2 + 0.2], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="presionBaja">
          <stop offset="0%" stopColor="#1A3A8A" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#1A3A8A" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="destello">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="40%" stopColor="#FFF1C9" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#FFF1C9" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={camaraT}>
        {/* Arrecife bajo el agua */}
        <rect x={-300} y={-400} width={1500} height={2300} fill="#0A3A5A" opacity={0.7} />
        {[0, 1, 2, 3, 4].map((k) => (
          <path key={k} d={`M ${-100 + k * 260} 300 L ${-40 + k * 260} 1400`} stroke="#8AD8F8" strokeWidth={60} opacity={0.04} />
        ))}
        {BURBUJAS.map((b, i) => {
          const p = (t * 0.12 + b.f) % 1;
          return <circle key={i} cx={-100 + b.x * 1100 + Math.sin(t * 2 + i) * 8} cy={1400 - p * 1100} r={b.r} fill="none" stroke="#B8E8F8" strokeWidth={2} opacity={0.4 * (1 - p)} />;
        })}
        <path d="M -300 1290 Q 100 1250 500 1280 T 1300 1270 L 1300 1900 L -300 1900 Z" fill="#C8B080" />
        <path d="M -300 1290 C -200 1080, -40 1060, 40 1290 Z" fill="#4A4060" />
        <path d="M -150 1290 C -120 1150, -60 1100, 20 1100" fill="none" stroke="#E86A9A" strokeWidth={14} strokeLinecap="round" />
        <path d="M -80 1290 C -60 1180, -20 1160, 60 1150" fill="none" stroke="#E86A9A" strokeWidth={10} strokeLinecap="round" />
        {/* Vidrio del acuario */}
        <rect x={VIDRIO_X} y={300} width={30} height={1600} fill="#B8E8F8" opacity={0.22} />
        <line x1={VIDRIO_X} y1={300} x2={VIDRIO_X} y2={1900} stroke="#D8F4FF" strokeWidth={4} opacity={0.6} />
        {grieta > 0
          ? [-70, -35, -5, 25, 60, 110, 160, 200].map((a, k) => {
              const r = (120 + (k % 3) * 70) * grieta;
              const ar = (a * Math.PI) / 180;
              return <path key={k} d={`M ${VIDRIO_X} ${punta[1]} l ${Math.cos(ar) * r * 0.5} ${Math.sin(ar) * r * 0.5 + 10} l ${Math.cos(ar + 0.3) * r * 0.5} ${Math.sin(ar + 0.3) * r * 0.5}`} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.9} />;
            })
          : null}

        {/* Caracol */}
        <g opacity={caracolO}>
          <g transform={`translate(${CARACOL[0]} ${CARACOL[1]})`}>
            <path d="M -70 50 C -80 -30, -20 -70, 30 -50 C 80 -30, 80 40, 40 50 Z" fill="#D8A868" />
            <path d="M 0 30 C -40 30, -40 -30, 0 -30 C 30 -30, 30 10, 5 10" fill="none" stroke="#8A5A28" strokeWidth={6} />
            {roto1 ? <path d="M -60 -10 L -30 0 L -45 20 L -20 30" fill="none" stroke="#2A1A10" strokeWidth={5} /> : null}
          </g>
          {roto2 > 0
            ? ESQUIRLAS.map((e, i) => (
                <path key={i} d="M 0 0 l 16 -6 l 6 14 z" fill="#D8A868" transform={`translate(${CARACOL[0] + Math.cos(e.a) * e.v * roto2} ${CARACOL[1] + Math.sin(e.a) * e.v * roto2 + 120 * roto2 * roto2}) rotate(${roto2 * 300 + i * 40})`} />
              ))
            : null}
        </g>

        {/* Estela del golpe a cámara lenta */}
        {lento > 0.05 && lento < 0.98 ? (
          <path d={`M ${mx + 69 * CM.s} ${CM.y + 34 * CM.s} m 0 ${118 * CM.s} a ${118 * CM.s} ${118 * CM.s} 0 0 0 ${118 * CM.s} ${-118 * CM.s}`} fill="none" stroke="#F8D848" strokeWidth={10} opacity={0.35} strokeDasharray="20 14" />
        ) : null}
        <Mantis x={mx} y={CM.y} s={CM.s} brazo={brazo} t={t} />
        {flash > 0 ? (
          <g>
            <circle cx={punta[0] + 20} cy={punta[1]} r={140 * flash} fill="url(#destello)" />
            <circle cx={punta[0] + 22} cy={punta[1]} r={30 * flash} fill="none" stroke="#FFFFFF" strokeWidth={4} />
          </g>
        ) : null}
        <Pildora x={590} y={880} texto="¡PUM!" color={C.red} o={Math.max(golpe(G1, 0.01, 0.8), golpe(G2, 0.01, 0.8), golpe(gVidrio, 0.01, 1.4))} tam={60} />

        {/* Regla: del tamaño de un dedo */}
        {regla > 0 ? (
          <g opacity={regla}>
            <rect x={CM.x - 430 * CM.s} y={1330} width={(430 + 140) * CM.s} height={50} rx={8} fill="#F8E8B0" />
            {new Array(11).fill(0).map((_, k) => (
              <line key={k} x1={CM.x - 430 * CM.s + (k * (570 * CM.s)) / 10} y1={1330} x2={CM.x - 430 * CM.s + (k * (570 * CM.s)) / 10} y2={k % 5 === 0 ? 1366 : 1352} stroke="#5A4030" strokeWidth={3} />
            ))}
            <text x={CM.x - 70} y={1440} textAnchor="middle" fill="#F8E8B0" fontFamily={mono} fontSize={44} fontWeight={700}>
              ≈ 10 cm
            </text>
          </g>
        ) : null}
        {/* Bala de comparación */}
        {bala > 0 && bala < 1 ? (
          <g transform={`translate(${-100 + 1100 * bala} 820)`}>
            <path d="M -200 0 L -40 0" stroke="#E8E6F0" strokeWidth={4} opacity={0.5} strokeDasharray="30 12" />
            <path d="M -40 -16 L 20 -16 Q 50 0 20 16 L -40 16 Z" fill="#D8A848" />
          </g>
        ) : null}
        <Pildora x={560} y={1450} texto="80 km/h" color={C.yellow} o={velocidad} />
        <Pildora x={230} y={880} texto="0,003 s" color={C.cyan} o={crono} tam={44} />

        {/* Brazo por dentro */}
        <g opacity={brazoB}>
          <rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          {/* Segmento del brazo (mero) */}
          <rect x={1420} y={930} width={640} height={200} rx={70} fill="#5A2A2A" stroke={MAZO} strokeWidth={6} />
          {/* Músculo */}
          {new Array(7).fill(0).map((_, k) => (
            <path key={k} d={`M ${1470} ${1060 + k * 8 - 24} C ${1600} ${1050 + k * 8 - 24 - 10 * carga}, ${1750 * fibras + 300 * (1 - fibras)} ${1050 + k * 8 - 24 - 10 * carga}, ${1470 + 400 * fibras} ${1060 + k * 8 - 24}`} fill="none" stroke="#E86A6A" strokeWidth={6} opacity={0.85} />
          ))}
          {/* Resorte en silla de montar */}
          <g transform="translate(1700 985)">
            <path d={`M -90 0 Q 0 ${-50 - 50 * carga} 90 0`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
            <path d={`M -70 -40 Q 0 ${10 + 30 * carga} 70 -40`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
            <circle r={60 + 20 * carga} fill={C.yellow} opacity={0.15 * carga} />
          </g>
          {/* Pestillo */}
          <g transform={`translate(1990 1120) rotate(${-40 * pestilloAbre})`}>
            <rect x={-12} y={-70} width={24} height={80} rx={8} fill="#A8A8B8" />
          </g>
          {/* Mazo (dáctilo) */}
          <g transform={`translate(2070 1030) rotate(${anguloMazo})`}>
            <rect x={-20} y={-30} width={220} height={60} rx={30} fill={MAZO} />
            <circle cx={210} cy={0} r={52} fill="#F8D848" />
            <circle cx={222} cy={-10} r={18} fill="#FFF4A8" />
          </g>
          {suelta > 0 && suelta < 1 ? <path d="M 2210 1180 A 150 150 0 0 0 2270 1000" fill="none" stroke="#F8D848" strokeWidth={8} opacity={0.6} /> : null}
          {pumB > 0 ? <circle cx={2290} cy={1000} r={160 * pumB} fill="url(#destello)" /> : null}
          {/* Energía guardada */}
          <text x={1440} y={1330} fill={C.grey} fontFamily={mono} fontSize={30}>
            energía guardada
          </text>
          <rect x={1440} y={1350} width={840} height={40} rx={20} fill="#2A2440" />
          <rect x={1440} y={1350} width={840 * carga} height={40} rx={20} fill={C.yellow} />
        </g>
        <Pildora x={2050} y={760} texto="¡PUM!" color={C.red} o={interpolate(t, [T.pum, T.pum + 0.05, T.catapulta, T.catapulta + 0.3], [0, 1, 1, 0], clamp)} tam={60} />

        {/* Cavitación */}
        <g opacity={cav}>
          <rect x={CV.x0} y={CV.y0} width={CV.x1 - CV.x0} height={CV.y1 - CV.y0} rx={40} fill="#0E2A44" stroke="#3A3360" strokeWidth={4} />
          {/* Caparazón de la presa */}
          <rect x={CV.impacto} y={760} width={220} height={540} rx={30} fill="#D8A868" />
          {t > T.revienta + 0.2 ? <path d={`M ${CV.impacto} ${CV.cy - 30} l 60 -40 l 30 50 l 70 -30 M ${CV.impacto} ${CV.cy + 20} l 80 30 l 40 -20`} fill="none" stroke="#5A3A18" strokeWidth={6} /> : null}
          {/* Zona de presión baja detrás del mazo */}
          <ellipse cx={mazoX - 120} cy={CV.cy} rx={200} ry={120} fill="url(#presionBaja)" opacity={presion} />
          {/* Líneas de agua */}
          {[-160, -80, 0, 80, 160].map((dy, k) => (
            <path key={k} d={`M ${2640} ${CV.cy + dy} L ${mazoX - 60} ${CV.cy + dy * 0.6}`} stroke="#8AD8F8" strokeWidth={3} opacity={0.25 + 0.4 * avance} strokeDasharray="30 18" strokeDashoffset={-t * 300} />
          ))}
          {/* Burbujitas de vapor que se juntan */}
          {hervor > 0 && crece < 1
            ? BURBUJAS.slice(0, 10).map((b, i) => (
                <circle key={i} cx={mazoX + 90 + (b.x - 0.5) * 160 * (1 - crece)} cy={CV.cy + (b.f - 0.5) * 220 * (1 - crece)} r={b.r * 1.4 * hervor} fill="none" stroke="#E8F8FF" strokeWidth={3} />
              ))
            : null}
          {radioBurbuja > 1 ? (
            <g>
              <circle cx={mazoX + 140} cy={CV.cy} r={radioBurbuja} fill="#E8F8FF" opacity={0.25} stroke="#E8F8FF" strokeWidth={5} />
              <circle cx={mazoX + 140 - radioBurbuja * 0.35} cy={CV.cy - radioBurbuja * 0.35} r={radioBurbuja * 0.18} fill="#FFFFFF" opacity={0.7} />
            </g>
          ) : null}
          {ondas > 0 && ondas < 1
            ? [0, 1, 2].map((k) => <circle key={k} cx={mazoX + 140} cy={CV.cy} r={30 + (ondas * 300 - k * 60)} fill="none" stroke="#E8F8FF" strokeWidth={4} opacity={Math.max(0, 1 - ondas) * (1 - k * 0.25)} />)
            : null}
          {luz > 0 ? <circle cx={mazoX + 140} cy={CV.cy} r={220 * luz} fill="url(#destello)" /> : null}
          {/* Mazo */}
          <g transform={`translate(${mazoX} ${CV.cy})`}>
            <rect x={-420} y={-30} width={360} height={60} rx={30} fill={MAZO} />
            <circle r={80} fill="#F8D848" />
            <circle cx={20} cy={-18} r={26} fill="#FFF4A8" />
          </g>
          <Pildora x={3100} y={1360} texto="miles de °C" color={C.red} o={miles} tam={50} />
        </g>

        {/* Gráfica: dos golpes */}
        <g opacity={grafica}>
          <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx={30} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <text x={G.x0 + 50} y={G.y0 + 60} fill={C.grey} fontFamily={mono} fontSize={32}>
            fuerza sobre la presa
          </text>
          <line x1={G.x0 + 60} y1={G.base} x2={G.x1 - 60} y2={G.base} stroke="#5A5478" strokeWidth={3} />
          <path d={`M ${G.x0 + 60} ${G.base} L 2900 ${G.base} L 2950 ${G.base - 380 * pico1} L 3000 ${G.base} L 3200 ${G.base} L 3250 ${G.base - 260 * pico2} L 3300 ${G.base} L ${G.x1 - 60} ${G.base}`} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinejoin="round" />
          <text x={2950} y={G.base - 400 * pico1 - 20} textAnchor="middle" fill={MAZO} fontFamily={mono} fontSize={36} fontWeight={700} opacity={pico1}>
            1 · mazo
          </text>
          <text x={3250} y={G.base - 280 * pico2 - 20} textAnchor="middle" fill="#8AD8F8" fontFamily={mono} fontSize={36} fontWeight={700} opacity={pico2}>
            2 · burbuja
          </text>
        </g>
      </g>

      <Tag x={sx(mx + 120)} y={sy(CM.y - 120)} dx={-60} dy={-210} texto="camarón mantis" color="#5AD08A" o={ventana(T.mantis, T.dedo)} />
      <Tag x={sx(mx + 150)} y={sy(CM.y + 150)} dx={100} dy={220} texto="mazo" color="#F8D848" o={ventana(T.golpe, T.ochenta)} />
      <Tag x={sx(1560)} y={sy(1080)} dx={-40} dy={-250} texto="músculo" color="#E86A6A" o={ventana(T.musculos, T.carga)} />
      <Tag x={sx(1700)} y={sy(950)} dx={0} dy={-220} texto="resorte" color={C.yellow} o={ventana(T.carga, T.pestillo)} />
      <Tag x={sx(1990)} y={sy(1060)} dx={60} dy={300} texto="pestillo" color="#C8C8D8" o={ventana(T.pestillo, T.pum)} />
      <Tag x={sx(mazoX - 140)} y={sy(CV.cy - 60)} dx={-40} dy={-240} texto="presión baja" color="#8AB8F8" o={ventana(T.presion, T.burbuja)} />
      <Tag x={sx(mazoX + 140)} y={sy(CV.cy - 80)} dx={60} dy={-240} texto="vapor" color="#E8F8FF" o={ventana(T.burbuja, T.revienta)} />
      <Tag x={sx(VIDRIO_X)} y={sy(punta[1] - 80)} dx={-120} dy={-220} texto="vidrio" color="#D8F4FF" o={ventana(T.vidrio + 0.4, T.fin + 2)} />
    </svg>
  );
};
