import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Cabeza de perfil (mira a la izquierda) con la nariz en corte sagital: tabique, arterias y la red de Kiesselbach
type P2 = [number, number];
const K: P2 = [258, 1008];
const NARINA: P2 = [222, 1060];
const PIVOTE: P2 = [620, 1460];
const PIEL = "#C98A64";
const PIEL_OSCURA = "#A86A48";
const MUCOSA = "#C46A78";
const SANGRE = "#D8283C";

const CABEZA =
  "M 360 470 C 520 400, 820 430, 930 560 C 1010 660, 1000 900, 930 1040 C 880 1150, 820 1240, 800 1330 L 800 1760 L 470 1760 L 470 1420 " +
  "C 420 1390, 360 1350, 320 1310 C 290 1290, 285 1250, 295 1215 C 285 1200, 270 1190, 272 1175 C 280 1160, 285 1150, 280 1140 " +
  "C 262 1130, 258 1112, 268 1098 C 275 1085, 278 1075, 262 1068 C 240 1066, 205 1062, 186 1040 C 168 1020, 175 995, 196 975 " +
  "C 230 920, 270 820, 300 760 C 305 720, 300 700, 310 670 C 320 600, 330 520, 360 470 Z";
const CAVIDAD = "M 212 1050 C 220 960, 262 870, 302 812 C 380 798, 480 826, 548 880 C 596 930, 606 1010, 590 1070 L 262 1072 C 240 1066, 222 1062, 212 1050 Z";
const GARGANTA = "M 592 1072 C 612 1180, 606 1330, 610 1520";

// Las arterias que llegan a la red (de arriba, de atrás, del paladar y del labio)
const ARTERIAS: string[] = [
  `M 330 834 Q 300 920, ${K[0]} ${K[1]}`,
  `M 440 832 Q 360 900, ${K[0]} ${K[1]}`,
  `M 556 930 Q 400 960, ${K[0]} ${K[1]}`,
  `M 520 1066 Q 380 1040, ${K[0]} ${K[1]}`,
  `M 246 1100 Q 262 1060, ${K[0]} ${K[1]}`,
];
// Red fina: puntos alrededor de K unidos con sus dos vecinos más cercanos
const NODOS: P2[] = new Array(20).fill(0).map((_, i) => {
  const a = random(`na${i}`) * Math.PI * 2;
  const r = Math.sqrt(random(`nr${i}`)) * 44;
  return [K[0] + Math.cos(a) * r, K[1] + Math.sin(a) * r * 0.85];
});
const RAMAS: [P2, P2][] = [];
NODOS.forEach((p, i) => {
  const cerca = NODOS.map((q, j) => ({ j, d: Math.hypot(p[0] - q[0], p[1] - q[1]) }))
    .filter((v) => v.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2);
  cerca.forEach((v) => {
    if (v.j > i) {
      RAMAS.push([p, NODOS[v.j]]);
    }
  });
});
const GRIETAS = [
  `M ${K[0] - 40} ${K[1] - 18} L ${K[0] - 22} ${K[1] - 8} L ${K[0] - 10} ${K[1] - 16} L ${K[0] + 8} ${K[1] - 2} L ${K[0] + 30} ${K[1] - 10}`,
  `M ${K[0] - 26} ${K[1] + 22} L ${K[0] - 8} ${K[1] + 12} L ${K[0] + 6} ${K[1] + 20} L ${K[0] + 26} ${K[1] + 8}`,
];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1080, 0.95],
  [T.pero - 0.4, 560, 1080, 0.97],
  [T.pero + 0.6, 330, 1000, 2.4],
  [T.diminuto + 0.2, 330, 1000, 2.45],
  [T.diminuto + 1.0, K[0], K[1], 4.0],
  [T.parteDelantera - 0.2, K[0], K[1], 4.1],
  [T.parteDelantera + 0.7, 390, 960, 2.0],
  [T.red - 0.4, 390, 960, 2.05],
  [T.red + 0.6, K[0], K[1], 6.5],
  [T.nueve - 0.4, K[0], K[1], 6.6],
  [T.nueve + 0.6, 320, 1010, 2.4],
  [T.agrieta - 0.6, 320, 1010, 2.45],
  [T.agrieta + 0.3, K[0], K[1], 6.5],
  [T.abre + 1.0, K[0], K[1], 6.6],
  [T.irrigada + 0.9, 390, 980, 2.0],
  [T.pararlo - 0.3, 390, 980, 2.05],
  [T.pararlo + 0.6, 470, 1120, 0.95],
  [T.veinte - 0.3, 480, 1120, 0.97],
  [T.veinte + 0.6, 560, 1250, 0.62],
  [T.noEs - 0.3, 560, 1250, 0.64],
  [T.noEs + 0.7, K[0], K[1], 6.0],
  [T.fin, K[0], K[1], 6.2],
];

const camara = (t: number) => {
  const K2 = camaraKeys();
  let k = 0;
  while (k < K2.length - 1 && K2[k + 1][0] <= t) {
    k++;
  }
  const a = K2[k];
  const b = K2[Math.min(k + 1, K2.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

// Inclinación de la cabeza (grados, sentido horario = hacia atrás)
const inclinacion = (t: number) =>
  interpolate(t, [T.delante - 0.2, T.delante + 0.6, T.atras - 0.2, T.atras + 0.6, T.veinte - 0.4, T.veinte + 0.4], [0, -18, -18, 18, 18, 0], suave);

const gira = (p: P2, grados: number): P2 => {
  const a = (grados * Math.PI) / 180;
  const dx = p[0] - PIVOTE[0];
  const dy = p[1] - PIVOTE[1];
  return [PIVOTE[0] + dx * Math.cos(a) - dy * Math.sin(a), PIVOTE[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};

// ¿Sangra por la nariz en el instante t?
const sangra = (t: number) =>
  (t > 0.3 && t < T.pero) || (t > T.abre + 0.5 && t < T.aprieta + 0.3);

const GOTAS = new Array(90).fill(0).map((_, i) => ({ nace: i * 0.36, dx: (random(`gx${i}`) - 0.5) * 50 }));

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

export const Cabeza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  // Sacudidas al estornudar, sonarse y rascarse
  const golpe = [T.basta + 0.55, T.basta + 1.35, T.basta + 2.25].reduce(
    (s, tc) => s + interpolate(t, [tc, tc + 0.05, tc + 0.35], [0, 1, 0], clamp),
    0,
  );
  const ox = Math.sin(t * 70) * 6 * golpe;
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ang = inclinacion(t);
  const s = (p: P2): P2 => {
    const q = gira(p, ang);
    return [sx(q[0]), sy(q[1])];
  };

  const corte = interpolate(t, [T.pero - 0.2, T.pero + 0.5], [0, 1], clamp);
  const punto = interpolate(t, [T.diminuto - 0.1, T.diminuto + 0.3, T.parteDelantera - 0.2, T.parteDelantera + 0.2], [0, 1, 1, 0], clamp);
  const tabique = interpolate(t, [T.tabique - 0.2, T.tabique + 0.4], [0, 1], clamp);
  const arterias = ARTERIAS.map((_, i) => interpolate(t, [T.cinco + i * 0.25, T.cinco + i * 0.25 + 0.7], [0, 1], suave));
  const red = interpolate(t, [T.red - 0.2, T.red + 0.6], [0, 1], clamp);
  const capa = interpolate(t, [T.capa - 0.1, T.capa + 0.5], [0, 1], clamp);
  const seco = interpolate(t, [T.seco, T.agrieta], [0, 1], clamp);
  const grietas = interpolate(t, [T.agrieta, T.agrieta + 0.5], [0, 1], clamp);
  const abre = interpolate(t, [T.abre - 0.1, T.abre + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cura = interpolate(t, [T.diezMin, T.atras], [1, 0.25], clamp);
  const late = t > T.irrigada && t < T.pararlo ? 1 + 0.6 * Math.max(0, Math.sin(t * 7.5)) ** 4 : 1;
  const aire = interpolate(t, [T.seco - 0.2, T.seco + 0.3, T.agrieta - 0.3, T.agrieta], [0, 1, 1, 0], clamp);
  const calor = interpolate(t, [T.calefaccion - 0.1, T.calefaccion + 0.3, T.agrieta - 0.3, T.agrieta], [0, 1, 1, 0], clamp);
  const dedos = interpolate(t, [T.aprieta - 0.2, T.aprieta + 0.4, T.atras - 0.3, T.atras], [0, 1, 1, 0], suave);
  const garganta = interpolate(t, [T.atras + 0.3, T.garganta + 0.6], [0, 1], suave) * interpolate(t, [T.veinte - 0.4, T.veinte], [1, 0], clamp);
  const regueroA = interpolate(t, [0.3, 1.0, T.pero - 0.5, T.pero], [0, 1, 1, 0], clamp);
  const regueroB = interpolate(t, [T.abre + 0.5, T.abre + 1.2, T.aprieta, T.aprieta + 0.8], [0, 1, 1, 0], clamp);

  // Etiquetas ancladas
  const tagAqui = punto;
  const tagTabique = interpolate(t, [T.tabique, T.tabique + 0.4, T.cinco - 0.2, T.cinco + 0.2], [0, 1, 1, 0], clamp);
  const tagCapa = interpolate(t, [T.capa + 0.2, T.capa + 0.6, T.nueve - 0.4, T.nueve], [0, 1, 1, 0], clamp);
  const causa = t < T.calefaccion ? "aire seco" : t < T.resfriado ? "calefacción" : "resfriado";
  const tagCausa = interpolate(t, [T.seco, T.seco + 0.3, T.agrieta - 0.4, T.agrieta], [0, 1, 1, 0], clamp);
  const accion = t < T.basta + 1.2 ? "estornudo" : t < T.basta + 2.1 ? "sonarse" : "rascarse";
  const tagAccion = interpolate(t, [T.basta + 0.4, T.basta + 0.7, T.abre - 0.3, T.abre], [0, 1, 1, 0], clamp);
  const tagBlanda = interpolate(t, [T.aprieta + 0.5, T.aprieta + 0.9, T.atras - 0.3, T.atras], [0, 1, 1, 0], clamp);
  const tagGarganta = interpolate(t, [T.garganta, T.garganta + 0.4, T.veinte - 0.4, T.veinte], [0, 1, 1, 0], clamp);

  const piel = (p: number) => (p < 0.5 ? MUCOSA : "#B89A8A");

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="brillo-nz" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id="cavidad-nz">
          <path d={CAVIDAD} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - cx * zoom + ox} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Aire seco y calor entrando por la nariz */}
        {aire > 0 ? (
          <g opacity={aire}>
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${60 - k * 20} ${1120 + k * 22} C 130 ${1100 + k * 10}, 180 ${1080 + k * 6}, ${NARINA[0]} ${NARINA[1] - 4}`}
                fill="none"
                stroke={C.white}
                strokeWidth={3}
                strokeDasharray="12 10"
                strokeDashoffset={-60 * t}
                vectorEffect="non-scaling-stroke"
                opacity={0.7}
              />
            ))}
          </g>
        ) : null}
        {calor > 0 ? (
          <g opacity={calor}>
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${40 + k * 40} 1180 q 10 -20 0 -40 q -10 -20 0 -40 q 10 -20 0 -40`}
                fill="none"
                stroke={C.orange}
                strokeWidth={4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                transform={`translate(0 ${-((t * 60 + k * 30) % 60)})`}
              />
            ))}
          </g>
        ) : null}

        <g transform={`rotate(${ang} ${PIVOTE[0]} ${PIVOTE[1]})`}>
          {/* Cabeza */}
          <path d={CABEZA} fill={PIEL} />
          <ellipse cx={720} cy={900} rx={44} ry={70} fill={PIEL_OSCURA} />
          <path d="M 330 742 Q 360 728, 400 740" fill="none" stroke="#5A3A2A" strokeWidth={8} strokeLinecap="round" />
          <ellipse cx={372} cy={782} rx={20} ry={11} fill="#F4EEE8" />
          <circle cx={364} cy={782} r={7} fill="#2A1A14" />
          <ellipse cx={228} cy={1040} rx={34} ry={18} fill={PIEL_OSCURA} opacity={1 - corte * 0.6} />

          {/* Corte: cavidad nasal y tabique */}
          {corte > 0 ? (
            <g opacity={corte}>
              <path d={CAVIDAD} fill="#3A1F2E" />
              <g clipPath="url(#cavidad-nz)">
                <path d={CAVIDAD} fill={MUCOSA} opacity={0.35 + 0.3 * tabique} />
                {/* Arterias */}
                {ARTERIAS.map((d, i) => (
                  <path key={i} d={d} fill="none" stroke={SANGRE} strokeWidth={5 * late} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arterias[i]} />
                ))}
                {/* Red de Kiesselbach */}
                <g opacity={red}>
                  {RAMAS.map(([a, b], i) => (
                    <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={SANGRE} strokeWidth={2.4 * late} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  ))}
                  {NODOS.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r={1.6} fill={SANGRE} />
                  ))}
                </g>
                {/* Capa fina que cubre la red: se reseca y se agrieta */}
                {capa > 0 ? (
                  <g opacity={capa}>
                    <ellipse cx={K[0]} cy={K[1]} rx={58} ry={50} fill={piel(seco)} opacity={0.32 + 0.25 * seco} />
                    <ellipse cx={K[0]} cy={K[1]} rx={58} ry={50} fill="none" stroke={C.white} strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={0.5} />
                    {GRIETAS.map((d, i) => (
                      <path key={i} d={d} fill="none" stroke="#4A1A26" strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - grietas} />
                    ))}
                  </g>
                ) : null}
                {/* El vaso que se abre */}
                {abre > 0 ? (
                  <g>
                    <circle cx={K[0] + 6} cy={K[1] + 4} r={22 * abre * cura} fill={SANGRE} opacity={0.5} filter="url(#brillo-nz)" />
                    <circle cx={K[0] + 6} cy={K[1] + 4} r={12 * abre * cura} fill={SANGRE} />
                    <path d={`M ${K[0] + 6} ${K[1] + 10} C ${K[0] + 4} ${K[1] + 30}, 232 1046, ${NARINA[0]} ${NARINA[1]}`} fill="none" stroke={SANGRE} strokeWidth={8 * cura} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={abre} />
                  </g>
                ) : null}
              </g>
              {/* Garganta: hacia atrás la sangre baja por aquí */}
              {garganta > 0 ? (
                <path d={GARGANTA} fill="none" stroke={SANGRE} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - garganta} vectorEffect="non-scaling-stroke" />
              ) : null}
              <path d={CAVIDAD} fill="none" stroke={PIEL_OSCURA} strokeWidth={3} vectorEffect="non-scaling-stroke" />
            </g>
          ) : null}
          {/* Punto diminuto que brilla */}
          {punto > 0 ? <circle cx={K[0]} cy={K[1]} r={10 + 3 * Math.sin(t * 8)} fill={C.yellow} opacity={0.8 * punto} filter="url(#brillo-nz)" /> : null}

          {/* Reguero de sangre desde la narina */}
          {regueroA + regueroB > 0 ? (
            <path d={`M ${NARINA[0]} ${NARINA[1]} C 230 1080, 250 1095, 262 1110`} fill="none" stroke={SANGRE} strokeWidth={10} strokeLinecap="round" opacity={Math.min(1, regueroA + regueroB)} />
          ) : null}

          {/* Dedos apretando la parte blanda de la nariz */}
          {dedos > 0 ? (
            <g opacity={dedos} transform={`translate(${(1 - dedos) * -60} ${(1 - dedos) * 60})`}>
              <rect x={-28} y={-200} width={56} height={220} rx={28} fill={PIEL_OSCURA} stroke="#6A3A24" strokeWidth={3} vectorEffect="non-scaling-stroke" transform="translate(222 1026) rotate(-55)" />
              <rect x={-26} y={-200} width={52} height={220} rx={26} fill="#D89A74" stroke="#6A3A24" strokeWidth={3} vectorEffect="non-scaling-stroke" transform="translate(200 1000) rotate(-40)" />
              <ellipse cx={200} cy={1000} rx={18} ry={12} fill="#E8B090" transform="rotate(-40 200 1000)" />
            </g>
          ) : null}
        </g>

        {/* Gotas que caen (en el mundo, sin girar) */}
        {GOTAS.map((g, i) => {
          if (!sangra(g.nace) || t < g.nace) {
            return null;
          }
          const vida = t - g.nace;
          if (vida > 1.3) {
            return null;
          }
          const origen = gira(NARINA, inclinacion(g.nace));
          const x = origen[0] + g.dx * vida * 0.4 - 10;
          const y = origen[1] + 30 + 0.5 * 2200 * vida * vida;
          return <ellipse key={i} cx={x} cy={y} rx={9} ry={13} fill={SANGRE} />;
        })}
      </g>

      {/* Etiquetas ancladas (tamaño constante en pantalla) */}
      <Tag x={s(K)[0]} y={s(K)[1]} dx={-120} dy={-200} texto="aquí" color={C.yellow} o={tagAqui} />
      <Tag x={s([420, 900])[0]} y={s([420, 900])[1]} dx={60} dy={-220} texto="tabique" color={C.white} o={tagTabique} />
      <Tag x={s([K[0] + 50, K[1] - 30])[0]} y={s([K[0] + 50, K[1] - 30])[1]} dx={-130} dy={-230} texto="capa finísima" color={C.white} o={tagCapa} />
      <Tag x={s(NARINA)[0]} y={s(NARINA)[1]} dx={40} dy={220} texto={causa} color={C.orange} o={tagCausa} />
      <Tag x={s(K)[0]} y={s(K)[1]} dx={120} dy={240} texto={accion} color={C.red} o={tagAccion} />
      <Tag x={s([205, 1000])[0]} y={s([205, 1000])[1]} dx={150} dy={-220} texto="parte blanda" color={C.yellow} o={tagBlanda} />
      <Tag x={s([606, 1300])[0]} y={s([606, 1300])[1]} dx={200} dy={0} texto="garganta" color={C.red} o={tagGarganta} />
    </svg>
  );
};
