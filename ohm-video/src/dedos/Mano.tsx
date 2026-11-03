import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una mano con los dedos metidos en un recipiente con agua (las yemas se arrugan);
// en el centro, el corte de una yema (piel, vasos, glándulas y nervio); a la derecha, el neumático y una yema que canaliza el agua.
type P2 = [number, number];
const PIEL = "#C98A64";
const PIEL_CLARA = "#E0A27C";
const PIEL_OSCURA = "#A86A48";
const MANGA = "#3E6E8E";
const AGUA = "#6AC8E8";
// Dedos (de derecha a izquierda: índice, corazón, anular, meñique): centro x, ancho, largo
const DEDOS: [number, number, number][] = [
  [640, 62, 250],
  [568, 64, 285],
  [496, 62, 262],
  [426, 56, 212],
];
const BASE_DEDOS = 990;
const TANQUE = { x0: 250, x1: 870, y0: 1060, agua: 1130, y1: 1500 };
const CORTE = { x0: 1400, x1: 2500, y0: 600, y1: 1500 };
const RUEDA = { x0: 2600, x1: 3500 };

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1080, 1.35],
  [T.parece - 0.3, 560, 1080, 1.37],
  [T.parece + 0.6, 700, 1060, 1.08],
  [T.danado - 0.3, 700, 1060, 1.1],
  [T.danado + 0.6, 540, 1060, 1.5],
  [T.pasa - 0.3, 540, 1060, 1.52],
  [T.pasa + 0.7, 1950, 1060, 0.96],
  [T.sirve - 0.3, 1950, 1060, 0.98],
  [T.sirve + 0.7, 3050, 1080, 1.0],
  [T.curioso - 0.3, 3050, 1080, 1.02],
  [T.curioso + 0.6, 560, 1100, 1.3],
  [T.final - 0.3, 560, 1100, 1.32],
  [T.final + 0.5, 560, 1080, 1.38],
  [T.fin, 560, 1080, 1.4],
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

// Arrugas de una yema: líneas onduladas que crecen con `w` (patrón fijo por dedo)
const Arrugas: React.FC<{ readonly cx: number; readonly punta: number; readonly ancho: number; readonly w: number; readonly semilla: number }> = ({ cx, punta, ancho, w, semilla }) => {
  if (w <= 0.02) {
    return null;
  }
  return (
    <g opacity={Math.min(1, w * 1.3)}>
      {[0, 1, 2, 3, 4].map((k) => {
        const y = punta - 22 - k * 17;
        const fase = random(`ar${semilla}-${k}`) * 6;
        const n = 8;
        const d = new Array(n + 1)
          .fill(0)
          .map((_, i) => {
            const x = cx - ancho / 2 + 8 + ((ancho - 16) * i) / n;
            return `${i === 0 ? "M" : "L"} ${x} ${y + Math.sin(i * 1.4 + fase) * 4 * w}`;
          })
          .join(" ");
        return <path key={k} d={d} fill="none" stroke={PIEL_OSCURA} strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
};

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

const GOTAS = new Array(16).fill(0).map((_, i) => ({ u: random(`gu${i}`), v: random(`gv${i}`), f: random(`gf${i}`) }));

export const Mano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Arrugas: aparecen en el gancho (cámara rápida) y se quedan; el índice con el nervio dañado se queda liso
  const arrugas = interpolate(t, [0, 3.6], [0.15, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const danado = ventana(T.danado - 0.2, T.pasa + 0.2);
  const rayos = danado;
  const reloj = Math.max(ventana(-1, T.parece + 0.2), ventana(T.cinco - 0.2, T.nervioso + 0.6));
  const vueltas = t < T.parece ? t * 1.6 : (t - T.cinco) * 1.6;
  const esponja = ventana(T.absorbe - 0.2, T.pista + 0.6);
  const hincha = interpolate(t, [T.absorbe, T.esponja + 0.4], [0, 1], clamp);
  const tachaEsponja = interpolate(t, [T.pista, T.pista + 0.3], [0, 1], clamp);

  // Corte de la yema: los vasos se estrechan, la yema pierde volumen, la piel se pliega
  const corte = ventana(T.pasa - 0.4, T.sirve + 0.4, 0.6, 0.6);
  const estrecha = interpolate(t, [T.estrecha, T.volumen + 1.2], [0, 1], suave);
  const pliegue = interpolate(t, [T.volumen, T.arrugas + 0.8], [0, 1], suave);
  const senal = ventana(T.nervioso - 0.2, T.volumen + 0.4);
  const glandulas = ventana(T.glandulas - 0.2, T.sirve);
  const gruesa = ventana(T.gruesa - 0.2, T.glandulas + 0.4);
  const vasosBrillo = ventana(T.vasos - 0.2, T.sirve);

  // Neumático y agarre
  const rueda = ventana(T.sirve - 0.4, T.curioso + 0.4, 0.6, 0.6);
  const canales = ventana(T.canalizan - 0.3, T.curioso);

  // Etiquetas
  const tagReloj = ventana(T.cinco, T.nervioso + 0.4);
  const tagNervio = ventana(T.danado + 0.4, T.pasa);
  const tagLiso = ventana(T.noArruga - 0.2, T.pasa);
  const tagVasos = ventana(T.estrecha, T.menosSangre + 0.8);
  const tagVolumen = ventana(T.volumen, T.arrugas);
  const tagPiel = ventana(T.piel, T.manos);
  const tagGruesa = ventana(T.gruesa, T.glandulas);
  const tagGlandulas = ventana(T.glandulas, T.vasos);
  const tagRedVasos = ventana(T.vasos, T.sirve);
  const tagCanales = ventana(T.canalizan, T.experimentos);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  // Superficie de la piel en el corte: onda que crece con el pliegue mientras la base baja
  const base = 860 + 70 * pliegue;
  const amp = 30 * pliegue;
  const puntos = (dy: number, a: number): P2[] =>
    new Array(60).fill(0).map((_, i) => [CORTE.x0 - 20 + i * 20, base + dy + Math.sin((i / 6.2) * Math.PI * 2) * a]);
  const onda = (dy: number, a: number) => puntos(dy, a).map((q, i) => `${i === 0 ? "M" : "L"} ${q[0]} ${q[1]}`).join(" ");
  const piel = `${onda(0, amp)} ${puntos(90, amp * 0.7)
    .reverse()
    .map((q) => `L ${q[0]} ${q[1]}`)
    .join(" ")} Z`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <clipPath id="corte-dd">
          <rect x={CORTE.x0} y={CORTE.y0} width={CORTE.x1 - CORTE.x0} height={CORTE.y1 - CORTE.y0} rx={40} />
        </clipPath>
      </defs>
      <g transform={camaraT}>
        {/* Baño: azulejos y encimera */}
        <rect x={-300} y={150} width={1400} height={1400} fill="#1E2A44" />
        {new Array(16).fill(0).map((_, f) =>
          new Array(12).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-290 + c * 120} y={160 + f * 90} width={112} height={82} rx={6} fill="#24324E" />),
        )}
        <rect x={-300} y={TANQUE.y1} width={1400} height={600} fill="#8A84A8" />
        <rect x={-300} y={TANQUE.y1} width={1400} height={14} fill="#D8D4E4" />

        {/* Recipiente (parte trasera) */}
        <rect x={TANQUE.x0} y={TANQUE.y0} width={TANQUE.x1 - TANQUE.x0} height={TANQUE.y1 - TANQUE.y0} rx={20} fill="rgba(255,255,255,0.06)" />

        {/* Manga y muñeca */}
        <rect x={420} y={150} width={250} height={470} rx={20} fill={MANGA} />
        <path d="M 450 200 L 450 560" stroke="#6898B8" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
        <path d="M 600 360 q 18 10 30 0 M 590 400 q 18 10 34 0" fill="none" stroke="#2A4C64" strokeWidth={4} strokeLinecap="round" />
        <rect x={420} y={580} width={250} height={46} rx={10} fill="#2A4C64" />
        <rect x={462} y={620} width={168} height={90} fill={PIEL} />
        {/* Palma */}
        <path d="M 396 700 C 396 680, 420 670, 460 672 L 640 672 C 680 674, 694 690, 694 720 L 690 960 C 688 990, 670 1004, 640 1004 L 420 1004 C 400 1000, 392 980, 394 950 Z" fill={PIEL} />
        <path d="M 430 760 C 500 790, 580 790, 650 750 M 440 860 C 520 880, 600 870, 660 840" fill="none" stroke={PIEL_OSCURA} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        {/* Pulgar */}
        <path d="M 680 770 C 740 820, 770 900, 772 990 C 774 1030, 740 1040, 726 1010 C 712 960, 700 890, 668 850 Z" fill={PIEL} />
        <path d="M 728 940 q 18 4 26 -4" fill="none" stroke={PIEL_OSCURA} strokeWidth={3} strokeLinecap="round" />
        {/* Cuatro dedos hacia abajo */}
        {DEDOS.map(([x, ancho, largo], i) => {
          const punta = BASE_DEDOS + largo;
          const w = i === 0 ? arrugas * (1 - danado) : arrugas;
          return (
            <g key={i}>
              <rect x={x - ancho / 2} y={BASE_DEDOS - 20} width={ancho} height={largo + 20} rx={ancho / 2} fill={i % 2 === 0 ? PIEL : "#C4865F"} />
              <rect x={x - ancho / 2 + 6} y={punta - 110} width={ancho - 12} height={104} rx={(ancho - 12) / 2} fill={PIEL_CLARA} opacity={0.6} />
              <path d={`M ${x - ancho / 2 + 10} ${BASE_DEDOS + largo * 0.33} l ${ancho - 20} 0 M ${x - ancho / 2 + 12} ${BASE_DEDOS + largo * 0.6} l ${ancho - 24} 0`} stroke={PIEL_OSCURA} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
              <Arrugas cx={x} punta={punta} ancho={ancho} w={w} semilla={i} />
            </g>
          );
        })}
        {/* Nervios de los dedos (rayos X); el del índice está cortado */}
        {rayos > 0 ? (
          <g opacity={rayos}>
            {DEDOS.map(([x, , largo], i) => (
              <g key={i}>
                <path d={`M ${x + (i - 1.5) * 4} 700 L ${x} ${BASE_DEDOS + largo - 30}`} stroke={C.yellow} strokeWidth={5} opacity={i === 0 ? 0.35 : 1} strokeDasharray={i === 0 ? "10 8" : undefined} />
                {i === 0 ? (
                  <g>
                    <line x1={x - 18} y1={BASE_DEDOS + 40} x2={x + 18} y2={BASE_DEDOS + 76} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
                    <line x1={x + 18} y1={BASE_DEDOS + 40} x2={x - 18} y2={BASE_DEDOS + 76} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
                  </g>
                ) : null}
              </g>
            ))}
          </g>
        ) : null}

        {/* Agua y frente del recipiente */}
        <rect x={TANQUE.x0} y={TANQUE.agua} width={TANQUE.x1 - TANQUE.x0} height={TANQUE.y1 - TANQUE.agua} fill={AGUA} opacity={0.32} />
        <path d={`M ${TANQUE.x0} ${TANQUE.agua} ${new Array(13).fill(0).map((_, i) => `L ${TANQUE.x0 + i * 52} ${TANQUE.agua + Math.sin(t * 3 + i) * 4}`).join(" ")}`} fill="none" stroke="#B8E8F8" strokeWidth={4} />
        {GOTAS.slice(0, 8).map((g, i) => {
          const p = (t * 0.25 + g.f) % 1;
          return <circle key={i} cx={TANQUE.x0 + 40 + g.u * 540} cy={TANQUE.y1 - 20 - p * (TANQUE.y1 - TANQUE.agua - 40)} r={5 + g.v * 5} fill="none" stroke="#E8F8FF" strokeWidth={2} opacity={0.7 * (1 - p)} />;
        })}
        <rect x={TANQUE.x0} y={TANQUE.y0} width={TANQUE.x1 - TANQUE.x0} height={TANQUE.y1 - TANQUE.y0} rx={20} fill="none" stroke="#C8E8F4" strokeWidth={6} opacity={0.7} />

        {/* Cronómetro */}
        {reloj > 0 ? (
          <g opacity={reloj} transform="translate(860 720)">
            <circle r={70} fill="#E8E6F0" />
            <circle r={58} fill="#1A1430" />
            <rect x={-12} y={-92} width={24} height={20} rx={4} fill="#E8E6F0" />
            <line x1={0} y1={0} x2={44 * Math.sin(vueltas)} y2={-44 * Math.cos(vueltas)} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
            <circle r={6} fill={C.yellow} />
            <text x={0} y={110} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              ~5 min
            </text>
          </g>
        ) : null}

        {/* Esponja: la idea "lógica" que no encaja */}
        {esponja > 0 ? (
          <g opacity={esponja} transform={`translate(1080 1300) scale(${1 + 0.25 * hincha})`}>
            <rect x={-90} y={-60} width={180} height={120} rx={20} fill="#E8D048" />
            {[
              [-50, -20],
              [10, -30],
              [50, 10],
              [-20, 25],
              [-60, 30],
              [40, -10],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={9} fill="#C8A830" />
            ))}
            <g opacity={tachaEsponja}>
              <line x1={-110} y1={-80} x2={110} y2={80} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
              <line x1={110} y1={-80} x2={-110} y2={80} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
            </g>
          </g>
        ) : null}

        {/* Corte de la yema */}
        <g opacity={corte}>
          <rect x={CORTE.x0} y={CORTE.y0} width={CORTE.x1 - CORTE.x0} height={CORTE.y1 - CORTE.y0} rx={40} fill="#1A1028" stroke="#3A3360" strokeWidth={4} />
          <g clipPath="url(#corte-dd)">
            {/* Agua encima */}
            <rect x={CORTE.x0} y={CORTE.y0} width={CORTE.x1 - CORTE.x0} height={240} fill={AGUA} opacity={0.3} />
            {/* Yema (pulpa) */}
            <path d={`${onda(0, amp)} L ${CORTE.x1 + 20} ${CORTE.y1} L ${CORTE.x0 - 20} ${CORTE.y1} Z`} fill="#D88A7A" />
            {/* Piel (epidermis gruesa) */}
            <path d={piel} fill="#E8B898" />
            <path d={onda(0, amp)} fill="none" stroke={gruesa > 0 ? C.yellow : "#C8906A"} strokeWidth={4 + 4 * gruesa} />
            {/* Vasos sanguíneos que se estrechan */}
            {[0, 1, 2, 3].map((k) => {
              const y = 1140 + k * 72;
              const r = 24 * (1 - 0.6 * estrecha);
              return (
                <g key={k}>
                  <rect x={CORTE.x0 + 30} y={y - r} width={CORTE.x1 - CORTE.x0 - 60} height={r * 2} rx={r} fill="#C83040" stroke={vasosBrillo > 0 ? C.yellow : "none"} strokeWidth={3 * vasosBrillo} />
                  {[0, 1, 2, 3, 4, 5].map((j) => {
                    const p = (t * (0.18 - 0.1 * estrecha) + j / 6 + k * 0.1) % 1;
                    return <circle key={j} cx={CORTE.x0 + 40 + p * (CORTE.x1 - CORTE.x0 - 80)} cy={y} r={Math.max(3, r * 0.45)} fill="#F07080" />;
                  })}
                </g>
              );
            })}
            {/* Glándulas de sudor: espirales con un conducto hasta la superficie */}
            {[0, 1, 2].map((k) => {
              const x = CORTE.x0 + 200 + k * 360;
              return (
                <g key={k} opacity={0.6 + 0.4 * glandulas}>
                  <path d={`M ${x} 1100 q 20 -10 0 -20 q -20 -10 0 -20 q 20 -10 0 -20 L ${x} ${base + 20}`} fill="none" stroke={glandulas > 0 ? C.cyan : "#7AB8D8"} strokeWidth={6} strokeLinecap="round" />
                </g>
              );
            })}
            {/* Nervio que ordena estrechar los vasos */}
            <path d={`M ${CORTE.x0} 1060 C ${CORTE.x0 + 200} 1060, ${CORTE.x0 + 300} 1100, ${CORTE.x0 + 420} 1140`} fill="none" stroke={C.yellow} strokeWidth={6} />
            {senal > 0
              ? [0, 1, 2].map((k) => {
                  const p = (t * 0.9 + k / 3) % 1;
                  return <circle key={k} cx={CORTE.x0 + p * 420} cy={1060 + p * p * 80} r={9} fill={C.yellow} opacity={senal} />;
                })
              : null}
            {/* Gotas en el agua */}
            {GOTAS.map((g, i) => (
              <circle key={i} cx={CORTE.x0 + 30 + g.u * 1040} cy={CORTE.y0 + 30 + g.v * 160 + Math.sin(t + i) * 6} r={4} fill="#E8F8FF" opacity={0.6} />
            ))}
          </g>
        </g>

        {/* Neumático y yema que canalizan el agua */}
        <g opacity={rueda}>
          <rect x={RUEDA.x0} y={CORTE.y0} width={RUEDA.x1 - RUEDA.x0} height={CORTE.y1 - CORTE.y0} rx={40} fill="#1A1428" stroke="#3A3360" strokeWidth={4} />
          <rect x={RUEDA.x0 + 20} y={1400} width={RUEDA.x1 - RUEDA.x0 - 40} height={80} fill="#3A3448" />
          <rect x={RUEDA.x0 + 20} y={1390} width={RUEDA.x1 - RUEDA.x0 - 40} height={14} fill={AGUA} opacity={0.6} />
          <g transform={`translate(${RUEDA.x0 + 620} 1170) rotate(${t * 40})`}>
            <circle r={220} fill="#222028" />
            {new Array(24).fill(0).map((_, k) => (
              <rect key={k} x={-14} y={-222} width={28} height={40} fill="#0A0810" transform={`rotate(${k * 15})`} />
            ))}
            <circle r={110} fill="#8A8A9A" />
            <circle r={30} fill="#4A4A58" />
          </g>
          {canales > 0
            ? new Array(8).fill(0).map((_, k) => {
                const p = (t * 1.2 + k / 8) % 1;
                return <circle key={k} cx={RUEDA.x0 + 620 + (k % 2 === 0 ? -1 : 1) * (230 + p * 120)} cy={1380 - p * 120 + p * p * 140} r={8} fill={AGUA} opacity={canales * (1 - p)} />;
              })
            : null}
          {/* Yema arrugada vista de cerca, con el agua que corre por los surcos */}
          <g transform={`translate(${RUEDA.x0 + 200} 860)`}>
            <ellipse cx={0} cy={0} rx={150} ry={190} fill={PIEL_CLARA} />
            {[-120, -70, -20, 30, 80, 130].map((y, k) => (
              <path key={k} d={`M -130 ${y} q 30 -14 60 0 t 60 0 t 60 0 t 60 0`} fill="none" stroke={PIEL_OSCURA} strokeWidth={6} strokeLinecap="round" opacity={Math.abs(y) < 150 ? 1 : 0} />
            ))}
            {canales > 0
              ? [-95, -45, 5, 55, 105].map((y, k) => {
                  const p = (t * 0.8 + k * 0.2) % 1;
                  return <circle key={k} cx={-120 + p * 240} cy={y} r={9} fill={AGUA} opacity={canales} />;
                })
              : null}
          </g>
        </g>
      </g>

      <Tag x={sx(860)} y={sy(650)} dx={-180} dy={-130} texto="cámara rápida" color={C.white} o={ventana(0.3, T.parece)} />
      <Tag x={sx(860)} y={sy(650)} dx={-60} dy={-150} texto="tiempo" color={C.yellow} o={tagReloj} />
      <Tag x={sx(DEDOS[0][0])} y={sy(BASE_DEDOS + 58)} dx={220} dy={-120} texto="nervio dañado" color={C.red} o={tagNervio} />
      <Tag x={sx(DEDOS[0][0])} y={sy(BASE_DEDOS + DEDOS[0][2] - 50)} dx={220} dy={150} texto="sin arrugas" color={C.red} o={tagLiso} />
      <Tag x={sx(CORTE.x0 + 700)} y={sy(1212)} dx={0} dy={260} texto="vasos sanguíneos" color={C.red} o={tagVasos} />
      <Tag x={sx(CORTE.x0 + 900)} y={sy(1020)} dx={0} dy={-260} texto="menos volumen" color={C.yellow} o={tagVolumen} />
      <Tag x={sx(CORTE.x0 + 560)} y={sy(base)} dx={0} dy={-240} texto="la piel se pliega" color={C.yellow} o={tagPiel} />
      <Tag x={sx(CORTE.x0 + 560)} y={sy(base + 40)} dx={0} dy={-240} texto="piel gruesa" color={C.yellow} o={tagGruesa} />
      <Tag x={sx(CORTE.x0 + 200)} y={sy(1060)} dx={150} dy={-250} texto="glándulas de sudor" color={C.cyan} o={tagGlandulas} />
      <Tag x={sx(CORTE.x0 + 800)} y={sy(1284)} dx={0} dy={210} texto="red de vasos" color={C.red} o={tagRedVasos} />
      <Tag x={sx(RUEDA.x0 + 200)} y={sy(860)} dx={120} dy={-260} texto="canales" color={C.cyan} o={tagCanales} />
    </svg>
  );
};
