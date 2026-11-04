import { Easing, interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una Venus atrapamoscas con dos trampas (la de arriba caza una mosca en el gancho,
// la de abajo se cierra con un palillo); en el centro, la trampa vista desde arriba (pelos y señal eléctrica)
// y debajo la gráfica del calcio (memoria); a la derecha, el corte de los lóbulos que invierten su curva.
const VERDE = "#5AA83A";
const VERDE_OSC = "#3A7A2A";
const ROJO_IN = "#C8384A";
const PELO = "#F0E0A0";
const H = { x: 200, y: 760, s: 1.4 };
const D = { x: 330, y: 1250, s: 1.9 };
const G = { x0: 1360, x1: 2340, y0: 1600, y1: 2260, ejeX0: 1440, ejeX1: 2280, base: 2190, alto: 440 };
const BISAGRA: [number, number] = [3100, 1350];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 400, 760, 1.7],
  [T.toca - 0.4, 400, 760, 1.76],
  [T.toca + 0.3, 590, 1230, 1.6],
  [T.noCerebro - 0.3, 590, 1230, 1.64],
  [T.noCerebro + 0.4, 1850, 1030, 1.05],
  [T.unSolo - 0.3, 1850, 1030, 1.07],
  [T.unSolo + 0.4, 1850, 1930, 1.05],
  [T.sinMusculos - 0.3, 1850, 1930, 1.07],
  [T.sinMusculos + 0.4, 3100, 1080, 1.1],
  [T.insecto - 0.3, 3100, 1080, 1.13],
  [T.insecto + 0.4, 400, 780, 1.7],
  [T.noPiensa - 0.2, 400, 780, 1.74],
  [T.noPiensa + 0.5, 520, 1060, 1.0],
  [T.fin + 2, 520, 1060, 1.05],
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

// Punto del lóbulo inferior (coordenadas locales) en el mundo, para una trampa con apertura `abre` (grados)
const aMundo = (tr: { x: number; y: number; s: number }, abre: number, px: number, py: number): [number, number] => {
  const a = ((abre / 2) * Math.PI) / 180;
  return [tr.x + (px * Math.cos(a) - py * Math.sin(a)) * tr.s, tr.y + (px * Math.sin(a) + py * Math.cos(a)) * tr.s];
};
const PELOS_X = [95, 140, 185];

// Trampa vista de lado: bisagra en (0, 0), lóbulos hacia la derecha; `abre` es el ángulo entre lóbulos
const Trampa: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly abre: number; readonly dobla: number[]; readonly giro?: number }> = ({ x, y, s, abre, dobla, giro = 0 }) => {
  const lobulo = (
    <g>
      <path d="M 0 0 C 50 78, 200 88, 258 4 L 250 0 Z" fill={VERDE} stroke={VERDE_OSC} strokeWidth={4} />
      <path d="M 30 22 C 90 50, 170 52, 230 18" fill="none" stroke={VERDE_OSC} strokeWidth={3} opacity={0.6} />
      {[110, 130, 150, 170, 190, 210, 230, 248].map((tx) => (
        <line key={tx} x1={tx} y1={0} x2={tx + 10} y2={-36} stroke="#8AD86A" strokeWidth={4} strokeLinecap="round" />
      ))}
    </g>
  );
  const a = ((abre / 2) * Math.PI) / 180;
  const punta = (signo: number): [number, number] => [250 * Math.cos(a), signo * 250 * Math.sin(a)];
  const [bx, by] = punta(1);
  const [tx, ty] = punta(-1);
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${s})`}>
      <path d={`M 0 0 L ${bx} ${by} Q ${bx + 30} 0 ${tx} ${ty} Z`} fill={ROJO_IN} />
      <path d={`M 0 0 L ${bx * 0.9} ${by * 0.9} Q ${bx * 0.9 + 10} 0 ${tx * 0.9} ${ty * 0.9} Z`} fill="#A82838" opacity={0.6} />
      <g transform={`rotate(${abre / 2})`}>
        {PELOS_X.map((px, i) => {
          const b = ((dobla[i] ?? 0) * Math.PI) / 180;
          return (
            <g key={px}>
              <line x1={px} y1={-2} x2={px + Math.sin(b) * 30} y2={-2 - Math.cos(b) * 30} stroke={PELO} strokeWidth={3.5} strokeLinecap="round" />
              <circle cx={px} cy={-2} r={4} fill={PELO} />
            </g>
          );
        })}
        {lobulo}
      </g>
      <g transform={`rotate(${-abre / 2}) scale(1 -1)`}>{lobulo}</g>
    </g>
  );
};

// Mosca
const Mosca: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly o?: number; readonly escala?: number }> = ({ x, y, t, o = 1, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} opacity={o}>
    {[-1, 0, 1].map((k) => (
      <path key={k} d={`M ${k * 8} 4 l ${k * 6 - 4} 14 M ${k * 8} 4 l ${k * 6 + 4} 14`} stroke="#1A1A20" strokeWidth={2.5} />
    ))}
    <ellipse cx={-6} cy={-12} rx={14} ry={6 + 3 * Math.sin(t * 60)} fill="#D8E8F8" opacity={0.6} transform="rotate(-25 -6 -12)" />
    <ellipse cx={6} cy={-12} rx={14} ry={6 + 3 * Math.sin(t * 60 + 1)} fill="#D8E8F8" opacity={0.6} transform="rotate(25 6 -12)" />
    <ellipse cx={-4} cy={0} rx={16} ry={10} fill="#2A2A34" />
    <circle cx={14} cy={-2} r={8} fill="#2A2A34" />
    <circle cx={17} cy={-5} r={4} fill="#C83A3A" />
  </g>
);

// Burbuja con el número de toques
const Contador: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly pop: number; readonly o: number }> = ({ x, y, texto, color, pop, o }) =>
  o > 0 ? (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${1 + 0.35 * pop})`}>
      <circle r={62} fill="#0B091D" stroke={color} strokeWidth={6} />
      <text y={texto.length > 2 ? 12 : 22} textAnchor="middle" fill={color} fontFamily={mono} fontSize={texto.length > 2 ? 32 : 64} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

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

// Calcio en la célula: cada toque suma y luego se va perdiendo
const TOQUE1 = T.gota + 0.3;
const TOQUE2 = T.supera - 0.3;
const pulso = (tt: number, t0: number, alto: number) => (tt < t0 ? 0 : alto * Math.min(1, (tt - t0) / 0.3) * Math.exp(-Math.max(0, tt - t0 - 0.3) / 9));
const calcio = (tt: number) => pulso(tt, TOQUE1, 0.55) + pulso(tt, TOQUE2, 0.6);
const LIMITE = 0.8;
const gx = (tt: number) => G.ejeX0 + ((tt - 18.4) / (28.6 - 18.4)) * (G.ejeX1 - G.ejeX0);
const gy = (v: number) => G.base - v * G.alto;

// Lóbulo izquierdo del corte (bezier cuadrática) según el cierre p (0 abierto, 1 cerrado)
const corteLobulo = (p: number) => {
  const [hx, hy] = BISAGRA;
  const punta: [number, number] = [2780 + (3064 - 2780) * p, 880 + (820 - 880) * p];
  const ctrl: [number, number] = [3030 + (2880 - 3030) * p, 1080 + (1090 - 1080) * p];
  return { h: [hx, hy] as [number, number], ctrl, punta };
};
const bez = (l: ReturnType<typeof corteLobulo>, u: number): [number, number] => {
  const a = (1 - u) * (1 - u);
  const b = 2 * (1 - u) * u;
  const c = u * u;
  return [a * l.h[0] + b * l.ctrl[0] + c * l.punta[0], a * l.h[1] + b * l.ctrl[1] + c * l.punta[1]];
};

export const Planta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);
  const golpe = (a: number) => interpolate(t, [a, a + 0.12, a + 0.45], [0, 1, 0], clamp);

  // Gancho: la mosca toca dos pelos de la trampa de arriba y ¡zas!
  const H_TOQUE1 = 0.5;
  const H_TOQUE2 = 1.05;
  const H_CIERRE = 1.15;
  const abreH = interpolate(t, [H_CIERRE, H_CIERRE + 0.12], [70, 2], clamp);
  const lucha = t > T.insecto ? Math.sin(t * 34) * 1.6 * interpolate(t, [T.insecto, T.insecto + 0.3, T.digerir + 0.4, T.digerir + 1.2], [0, 1, 1, 0.3], clamp) : 0;
  const pH1 = aMundo(H, 70, PELOS_X[0], -32);
  const pH2 = aMundo(H, 70, PELOS_X[1], -32);
  const llega = interpolate(t, [0, 0.45], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const pasa = interpolate(t, [0.65, 1.0], [0, 1], suave);
  const moscaX = t < 0.6 ? 520 + (pH1[0] - 520) * llega : pH1[0] + (pH2[0] - pH1[0]) * pasa;
  const moscaY = t < 0.6 ? 600 + (pH1[1] - 8 - 600) * llega + Math.sin(t * 25) * 6 * (1 - llega) : pH1[1] - 8 + (pH2[1] - pH1[1]) * pasa;
  const moscaO = interpolate(t, [H_CIERRE, H_CIERRE + 0.1], [1, 0], clamp);
  const doblaH = [12 * golpe(H_TOQUE1) * 2, 14 * golpe(H_TOQUE2) * 2, 0];
  const cuentaH = t < H_TOQUE1 ? "0" : t < H_TOQUE2 ? "1" : t < H_CIERRE + 0.05 ? "2" : "¡ZAS!";
  const contadorH = ventana(-1, T.toca);
  // Final: la mosca sigue moviéndose, la trampa cuenta 3, 4, 5 y empieza a digerir
  const toquesFin = [T.insecto + 0.6, T.contando, T.cinco];
  const nFin = toquesFin.filter((x) => t >= x).length;
  const cuentaFin = nFin === 0 ? "2" : String(2 + nFin);
  const contadorFin = ventana(T.insecto, T.fin + 2);
  const popFin = toquesFin.reduce((acc, x) => acc + golpe(x), 0);
  const jugo = interpolate(t, [T.digerir, T.digerir + 0.6], [0, 1], clamp);

  // Demo: un palillo toca un pelo de la trampa de abajo, una vez (nada) y dos veces (¡zas!)
  const D_TOQUE1 = 3.12;
  const D_TOQUE2 = 5.72;
  const abreD = interpolate(t, [T.zas, T.zas + 0.12], [70, 2], clamp);
  const toqueD = interpolate(t, [D_TOQUE1 - 0.35, D_TOQUE1, D_TOQUE1 + 0.35], [0, 1, 0], clamp) + interpolate(t, [D_TOQUE2 - 0.35, D_TOQUE2, D_TOQUE2 + 0.3], [0, 1, 0], clamp);
  const pD = aMundo(D, abreD, PELOS_X[1], -30);
  const palilloD = 1 - toqueD;
  const palilloO = ventana(T.toca - 0.2, T.zas + 0.5, 0.3, 0.4);
  const cuentaD = t < D_TOQUE1 ? "0" : t < D_TOQUE2 ? "1" : t < T.zas + 0.05 ? "2" : "¡ZAS!";
  const contadorD = ventana(T.toca, T.noCerebro);
  const popD = golpe(D_TOQUE1) + golpe(D_TOQUE2) + golpe(T.zas);
  const crono = ventana(T.decima - 0.2, T.noCerebro);

  // Vista desde arriba: pelo que se dobla y señal que recorre la hoja
  const arriba = ventana(T.noCerebro - 0.5, T.unSolo + 0.4, 0.6, 0.6);
  const doblaB = interpolate(t, [T.dobla, T.dobla + 0.3, T.senal + 0.6, T.senal + 1.0], [0, 1, 1, 0], clamp);
  const onda = (k: number) => interpolate(t, [T.senal + k * 1.1, T.senal + k * 1.1 + 1.4], [0, 640], clamp);
  const ondaO = (k: number) => interpolate(t, [T.senal + k * 1.1, T.senal + k * 1.1 + 0.2, T.senal + k * 1.1 + 1.2, T.senal + k * 1.1 + 1.4], [0, 1, 1, 0], clamp);
  const pelosB = interpolate(t, [T.lobulo - 0.2, T.lobulo + 0.4], [0, 1], clamp);
  const PELO_B: [number, number] = [1700, 1060];

  // Gráfica del calcio
  const grafica = ventana(T.unSolo - 0.4, T.sinMusculos + 0.4, 0.6, 0.6);
  const tFin = Math.min(t, 28.6);
  const curva = t > 18.4 ? new Array(Math.max(2, Math.round((tFin - 18.4) / 0.05))).fill(0).map((_, i, arr) => {
    const tt = 18.4 + ((tFin - 18.4) * i) / (arr.length - 1);
    return `${i === 0 ? "M" : "L"} ${gx(tt).toFixed(1)} ${gy(calcio(tt)).toFixed(1)}`;
  }).join(" ") : "";
  const area = interpolate(t, [T.calcio, T.calcio + 0.5], [0, 1], clamp);
  const supera = calcio(t) > LIMITE && t < 28.6 ? 1 : 0;
  const cierreG = interpolate(t, [T.cierra2, T.cierra2 + 0.15], [0, 1], clamp);
  const gotaY = interpolate(t, [T.gota - 0.5, TOQUE1], [G.y0 + 40, gy(0) - 20], { ...clamp, easing: Easing.in(Easing.quad) });
  const veinte = ventana(T.veinte - 0.2, T.sinMusculos);

  // Corte de los lóbulos: tensos, el agua se mueve, la curva se invierte y salta
  const corte = ventana(T.sinMusculos - 0.4, T.insecto + 0.4, 0.6, 0.6);
  const cierreC = interpolate(t, [T.invierte, T.salta - 0.1], [0, 0.12], clamp) + interpolate(t, [T.salta, T.salta + 0.12], [0, 0.88], clamp);
  const tension = ventana(T.resorte - 0.2, T.salta, 0.3, 0.1);
  const agua = ventana(T.agua, T.salta + 0.2);
  const cronoC = ventana(T.salta + 0.1, T.insecto);
  const lobL = corteLobulo(cierreC);
  const ruta = (l: ReturnType<typeof corteLobulo>, dx: number) => `M ${l.h[0] + dx} ${l.h[1]} Q ${l.ctrl[0] + dx} ${l.ctrl[1]} ${l.punta[0] + dx} ${l.punta[1]}`;

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Pelos de la vista desde arriba (dos lóbulos)
  const pelosArriba: [number, number][] = [
    [1600, 900],
    PELO_B,
    [1590, 1140],
    [2100, 900],
    [2000, 1060],
    [2110, 1140],
  ];

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="lobulosArriba">
          <ellipse cx={1650} cy={1020} rx={210} ry={290} />
          <ellipse cx={2050} cy={1020} rx={210} ry={290} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        {/* Pantano: musgo y tallos */}
        <rect x={-300} y={-600} width={1500} height={2400} fill="#14203A" opacity={0.55} />
        <path d={`M -300 1500 ${new Array(16).fill(0).map((_, i) => `Q ${-260 + i * 100} ${1470 + (i % 2) * 20} ${-200 + i * 100} 1500`).join(" ")} L 1300 1900 L -300 1900 Z`} fill="#2A4A2A" />
        <rect x={-300} y={1540} width={1600} height={400} fill="#1E3420" />
        {/* Tallos (pecíolos) */}
        <path d={`M 150 1500 C 140 1200, 170 950, ${H.x} ${H.y}`} fill="none" stroke={VERDE_OSC} strokeWidth={22} strokeLinecap="round" />
        <path d={`M 230 1500 C 250 1400, 290 1300, ${D.x} ${D.y}`} fill="none" stroke={VERDE_OSC} strokeWidth={30} strokeLinecap="round" />
        <path d="M 100 1500 C 40 1380, -40 1300, -60 1220" fill="none" stroke={VERDE_OSC} strokeWidth={20} strokeLinecap="round" />
        <path d="M 260 1500 C 420 1450, 600 1440, 760 1400" fill="none" stroke={VERDE_OSC} strokeWidth={20} strokeLinecap="round" />
        <Trampa x={-60} y={1220} s={0.7} abre={12} dobla={[0, 0, 0]} giro={-150} />
        <Trampa x={760} y={1400} s={0.8} abre={55} dobla={[0, 0, 0]} giro={-12} />

        {/* Trampa de arriba (gancho y final) */}
        <Trampa x={H.x} y={H.y} s={H.s} abre={abreH} dobla={doblaH} giro={lucha} />
        <Mosca x={moscaX} y={moscaY} t={t} o={moscaO} escala={1.3} />
        {/* Patas de la mosca asomando y jugos digestivos */}
        {t > T.insecto
          ? [0, 1].map((k) => (
              <line key={k} x1={H.x + (190 + k * 50) * H.s} y1={H.y} x2={H.x + (196 + k * 50) * H.s} y2={H.y - 18 - 8 * Math.sin(t * 30 + k)} stroke="#1A1A20" strokeWidth={4} strokeLinecap="round" opacity={1 - jugo * 0.7} />
            ))
          : null}
        {jugo > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 0.8 + k / 3) % 1;
              return <ellipse key={k} cx={H.x + (140 + k * 50) * H.s} cy={H.y + 30 + p * 120} rx={7} ry={10} fill="#C8E848" opacity={jugo * (1 - p)} />;
            })
          : null}
        {jugo > 0 ? <ellipse cx={H.x + 160 * H.s} cy={H.y} rx={120 * H.s} ry={14} fill="#C8E848" opacity={0.18 * jugo} /> : null}

        {/* Trampa de abajo (demostración con palillo) */}
        <Trampa x={D.x} y={D.y} s={D.s} abre={abreD} dobla={[0, 25 * toqueD, 0]} />
        {palilloO > 0 ? (
          <g opacity={palilloO} transform={`translate(${pD[0] + 160 * palilloD} ${pD[1] - 120 * palilloD})`}>
            <line x1={0} y1={0} x2={320} y2={-300} stroke="#D8B070" strokeWidth={14} strokeLinecap="round" />
            <line x1={0} y1={0} x2={30} y2={-28} stroke="#A88048" strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : null}
        {crono > 0 ? (
          <g opacity={crono} transform={`translate(${D.x + 270} ${D.y + 230})`}>
            <rect x={-150} y={-46} width={300} height={92} rx={20} fill="#1A1430" stroke={C.yellow} strokeWidth={4} />
            <text x={0} y={18} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={50} fontWeight={700}>
              0,1 s
            </text>
          </g>
        ) : null}

        {/* Vista desde arriba: dos lóbulos con tres pelos cada uno */}
        <g opacity={arriba}>
          <rect x={1340} y={640} width={1020} height={780} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          {[1650, 2050].map((ex, i) => (
            <g key={ex}>
              {new Array(26).fill(0).map((_, k) => {
                const a = (k / 26) * Math.PI * 2;
                const lado = i === 0 ? Math.cos(a) < 0.3 : Math.cos(a) > -0.3;
                return lado ? <line key={k} x1={ex + Math.cos(a) * 205} y1={1020 + Math.sin(a) * 285} x2={ex + Math.cos(a) * 250} y2={1020 + Math.sin(a) * 330} stroke="#8AD86A" strokeWidth={5} strokeLinecap="round" /> : null;
              })}
              <ellipse cx={ex} cy={1020} rx={210} ry={290} fill={ROJO_IN} stroke={VERDE} strokeWidth={20} />
            </g>
          ))}
          <line x1={1850} y1={740} x2={1850} y2={1300} stroke={VERDE_OSC} strokeWidth={10} />
          {/* Células de la hoja que se encienden cuando pasa la señal */}
          <g clipPath="url(#lobulosArriba)">
            {new Array(13).fill(0).map((_, f) =>
              new Array(21).fill(0).map((__, c) => {
                const x = 1450 + c * 40 + (f % 2) * 20;
                const y = 760 + f * 44;
                const d = Math.hypot(x - PELO_B[0], y - PELO_B[1]);
                const brillo = Math.max(0, ...[0, 1].map((k) => ondaO(k) * Math.max(0, 1 - Math.abs(d - onda(k)) / 60)));
                return <circle key={`${f}-${c}`} cx={x} cy={y} r={14} fill={mezclaAmarillo(brillo)} opacity={0.35 + 0.65 * brillo} />;
              }),
            )}
            {[0, 1].map((k) => (ondaO(k) > 0 ? <circle key={k} cx={PELO_B[0]} cy={PELO_B[1]} r={onda(k)} fill="none" stroke={C.yellow} strokeWidth={8} opacity={ondaO(k)} /> : null))}
          </g>
          {pelosArriba.map(([x, y], i) => {
            const b = i === 1 ? doblaB : 0;
            return (
              <g key={i} opacity={pelosB}>
                <circle cx={x} cy={y} r={11} fill={PELO} />
                <line x1={x} y1={y} x2={x + 46 * b} y2={y - 56 + 30 * b} stroke={PELO} strokeWidth={6} strokeLinecap="round" />
              </g>
            );
          })}
        </g>

        {/* Gráfica: el calcio como memoria */}
        <g opacity={grafica}>
          <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx={30} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          <text x={G.x0 + 50} y={G.y0 + 60} fill={C.grey} fontFamily={mono} fontSize={32}>
            calcio en sus células
          </text>
          <line x1={G.ejeX0} y1={G.base} x2={G.ejeX1} y2={G.base} stroke="#5A5478" strokeWidth={3} />
          <line x1={G.ejeX0} y1={G.base} x2={G.ejeX0} y2={G.base - G.alto - 10} stroke="#5A5478" strokeWidth={3} />
          <line x1={G.ejeX0} y1={gy(LIMITE)} x2={G.ejeX1} y2={gy(LIMITE)} stroke={C.red} strokeWidth={4} strokeDasharray="16 10" />
          <text x={G.ejeX1} y={gy(LIMITE) - 14} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
            límite
          </text>
          {curva ? <path d={`${curva} L ${gx(tFin)} ${G.base} L ${gx(18.4)} ${G.base} Z`} fill={C.cyan} opacity={0.18 * area} /> : null}
          {curva ? <path d={curva} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinejoin="round" /> : null}
          {/* Gota de lluvia que cae sobre el primer toque */}
          {t > T.gota - 0.5 && t < TOQUE1 + 0.3 ? <path d={`M ${gx(TOQUE1)} ${gotaY - 30} q 16 26 0 34 q -16 -8 0 -34 z`} fill="#6AC8F8" /> : null}
          {[
            [TOQUE1, "1"],
            [TOQUE2, "2"],
          ].map(([tt, n]) =>
            t >= (tt as number) ? (
              <g key={n as string}>
                <circle cx={gx(tt as number)} cy={G.base + 30} r={22} fill={C.yellow} />
                <text x={gx(tt as number)} y={G.base + 41} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={28} fontWeight={700}>
                  {n}
                </text>
              </g>
            ) : null,
          )}
          <g opacity={veinte}>
            <path d={`M ${gx(TOQUE1)} ${G.y0 + 156} L ${gx(TOQUE1)} ${G.y0 + 140} L ${gx(TOQUE2)} ${G.y0 + 140} L ${gx(TOQUE2)} ${G.y0 + 156}`} fill="none" stroke={C.yellow} strokeWidth={4} />
            <text x={(gx(TOQUE1) + gx(TOQUE2)) / 2} y={G.y0 + 126} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={30} fontWeight={700}>
              menos de 20 s
            </text>
          </g>
          {supera ? <circle cx={gx(tFin)} cy={gy(calcio(tFin))} r={20 + 8 * Math.sin(t * 20)} fill="none" stroke={C.red} strokeWidth={6} /> : null}
          <g opacity={cierreG} transform={`translate(${G.x1 - 150} ${G.y0 + 250})`}>
            <rect x={-110} y={-40} width={220} height={74} rx={18} fill={C.red} />
            <text y={12} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={36} fontWeight={700}>
              ¡cierra!
            </text>
          </g>
        </g>

        {/* Corte de los lóbulos: la curva que se invierte */}
        <g opacity={corte}>
          <rect x={2600} y={640} width={1000} height={900} rx={40} fill="#14102A" stroke="#3A3360" strokeWidth={4} />
          {[1, -1].map((lado) => (
            <g key={lado} transform={lado === 1 ? undefined : `translate(${BISAGRA[0] * 2} 0) scale(-1 1)`}>
              <path d={ruta(lobL, 0)} fill="none" stroke={VERDE} strokeWidth={46} strokeLinecap="round" />
              <path d={ruta(lobL, 18)} fill="none" stroke={ROJO_IN} strokeWidth={12} strokeLinecap="round" />
              {[0, 1, 2].map((k) => (
                <line key={k} x1={lobL.punta[0]} y1={lobL.punta[1]} x2={lobL.punta[0] + 10 + k * 8} y2={lobL.punta[1] - 50 + k * 6} stroke="#8AD86A" strokeWidth={5} strokeLinecap="round" />
              ))}
              {/* Agua que pasa de una capa de células a la otra */}
              {agua > 0
                ? [0.3, 0.5, 0.7].map((u, k) => {
                    const [px, py] = bez(lobL, u);
                    const p = (t * 0.9 + k / 3) % 1;
                    return <circle key={k} cx={px + 22 - 44 * p} cy={py} r={9} fill="#6AC8F8" opacity={agua * (1 - Math.abs(p - 0.5))} />;
                  })
                : null}
            </g>
          ))}
          <circle cx={BISAGRA[0]} cy={BISAGRA[1]} r={26} fill={VERDE_OSC} />
          {/* Tensión, como un resorte */}
          {tension > 0 ? (
            <path
              d={`M ${bez(lobL, 0.5)[0] + 30} ${bez(lobL, 0.5)[1]} ${new Array(9).fill(0).map((_, i) => `L ${bez(lobL, 0.5)[0] + 30 + ((BISAGRA[0] - bez(lobL, 0.5)[0] - 30) * 2 * (i + 1)) / 10} ${bez(lobL, 0.5)[1] + (i % 2 === 0 ? -22 : 22) * (1 + 0.15 * Math.sin(t * 30))}`).join(" ")} L ${2 * BISAGRA[0] - bez(lobL, 0.5)[0] - 30} ${bez(lobL, 0.5)[1]}`}
              fill="none"
              stroke={C.yellow}
              strokeWidth={5}
              opacity={tension}
            />
          ) : null}
          {cronoC > 0 ? (
            <g opacity={cronoC} transform="translate(3100 1460)">
              <rect x={-150} y={-46} width={300} height={92} rx={20} fill="#1A1430" stroke={C.yellow} strokeWidth={4} />
              <text x={0} y={18} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={50} fontWeight={700}>
                0,1 s
              </text>
            </g>
          ) : null}
        </g>
      </g>

      <Contador x={sx(H.x + 190 * H.s)} y={sy(H.y - 250)} texto={cuentaH} color={cuentaH === "¡ZAS!" ? C.red : C.yellow} pop={golpe(H_TOQUE1) + golpe(H_TOQUE2) + golpe(H_CIERRE)} o={contadorH} />
      <Contador x={sx(D.x + 200 * D.s)} y={sy(D.y - 330)} texto={cuentaD} color={cuentaD === "¡ZAS!" ? C.red : C.yellow} pop={popD} o={contadorD} />
      <Contador x={sx(H.x + 190 * H.s)} y={sy(H.y - 230)} texto={cuentaFin} color={nFin === 3 ? C.red : C.yellow} pop={popFin} o={contadorFin} />
      <Tag x={sx(D.x + PELOS_X[1] * D.s)} y={sy(D.y - 60)} dx={-150} dy={-200} texto="pelo sensor" color={PELO} o={ventana(T.toca + 0.3, T.otraVez)} />
      <Tag x={sx(PELO_B[0])} y={sy(PELO_B[1])} dx={-60} dy={330} texto="se dobla" color={PELO} o={ventana(T.dobla, T.senal + 0.4)} />
      <Tag x={sx(H.x + 140 * H.s)} y={sy(H.y + 40)} dx={60} dy={200} texto="jugos digestivos" color="#C8E848" o={ventana(T.digerir + 0.3, T.noPiensa)} />
      <Tag x={sx(bez(lobL, 0.5)[0])} y={sy(bez(lobL, 0.5)[1])} dx={-80} dy={330} texto="agua" color="#6AC8F8" o={ventana(T.agua, T.invierte)} />
    </svg>
  );
};

// Del rojo de la hoja al amarillo de la señal
const mezclaAmarillo = (p: number) => {
  const a = [168, 40, 56];
  const b = [248, 200, 72];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * p));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};
