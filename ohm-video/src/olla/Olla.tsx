import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";

// Corte lateral de una olla a presión sobre el fuego. Todo depende del tiempo de la narración.
const POT = { x0: 260, x1: 820, top: 1000, bottom: 1390 };
const AGUA = { x0: 274, x1: 806, y: 1180, bottom: 1376 };
const METAL = "#8C88A8";
const GOMA = "#E8703C";

export const T_CIERRE = 12.08; // "cierras la olla"
const T_CERRADA = 12.9;

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

export const temperatura = (t: number) =>
  interpolate(t, [0, 3.3, 20.8, 22.8], [22, 100, 100, 120], suave);
export const presion = (t: number) => interpolate(t, [13.3, 17.7], [1.0, 1.9], suave);

// Cámara: [tiempo, centro x, centro y, zoom]
const CAMARA: [number, number, number, number][] = [
  [0, 540, 1120, 1.0],
  [7.5, 540, 1120, 1.04],
  [8.3, 540, 1150, 2.2],
  [11.4, 540, 1150, 2.25],
  [12.0, 540, 1120, 1.0],
  [18.3, 540, 1120, 1.04],
  [19.1, 540, 1110, 2.0],
  [23.8, 540, 1110, 2.05],
  [28.3, 540, 1120, 1.0],
  [29.2, 815, 1000, 4.0],
  [34.3, 815, 1000, 4.1],
  [34.9, 800, 1010, 3.2],
  [37.3, 800, 1010, 3.25],
  [38.1, 540, 900, 3.2],
  [46.4, 540, 900, 3.3],
  [47.1, 690, 945, 3.2],
  [48.9, 690, 945, 3.25],
  [49.6, 395, 945, 3.2],
  [51.9, 395, 945, 3.25],
  [52.7, 540, 1250, 0.95],
];

const camara = (t: number) => {
  let k = 0;
  while (k < CAMARA.length - 1 && CAMARA[k + 1][0] <= t) {
    k++;
  }
  const a = CAMARA[k];
  const b = CAMARA[Math.min(k + 1, CAMARA.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return {
    cx: a[1] + (b[1] - a[1]) * p,
    cy: a[2] + (b[2] - a[2]) * p,
    zoom: a[3] + (b[3] - a[3]) * p,
  };
};

const MOLECULAS = new Array(70).fill(0).map((_, i) => ({
  x: AGUA.x0 + 20 + random(`mx${i}`) * (AGUA.x1 - AGUA.x0 - 40),
  y: AGUA.y + 20 + random(`my${i}`) * (AGUA.bottom - AGUA.y - 30),
  f: random(`mf${i}`) * 10,
}));
const VAPOR = new Array(40).fill(0).map((_, i) => ({
  x: AGUA.x0 + 30 + random(`vx${i}`) * (AGUA.x1 - AGUA.x0 - 60),
  fase: random(`vf${i}`),
  fx: 0.6 + random(`vfx${i}`) * 0.9,
  fy: 0.8 + random(`vfy${i}`) * 1.1,
}));
const BURBUJAS = new Array(18).fill(0).map((_, i) => ({
  x: AGUA.x0 + 40 + random(`bx${i}`) * (AGUA.x1 - AGUA.x0 - 80),
  fase: random(`bf${i}`),
}));

const Nube: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly o: number }> = ({ x, y, r, o }) => (
  <circle cx={x} cy={y} r={r} fill="#FFFFFF" opacity={o} filter="url(#nube)" />
);

const Flecha: React.FC<{ readonly x: number; readonly y: number; readonly dir: 1 | -1; readonly o: number; readonly s?: number }> = ({
  x,
  y,
  dir,
  o,
  s = 1,
}) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={0} x2={0} y2={-34 * dir} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
    <polyline points={`-12,${-22 * dir} 0,${-36 * dir} 12,${-22 * dir}`} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Lectura: React.FC<{ readonly x: number; readonly titulo: string; readonly valor: string; readonly unidad: string; readonly color: string }> = ({
  x,
  titulo,
  valor,
  unidad,
  color,
}) => (
  <g>
    <text x={x} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>{titulo}</text>
    <text x={x} y={330} fill={color} fontFamily={mono} fontSize={96} fontWeight={700}>
      {valor}
      <tspan fill={C.grey} fontSize={48}> {unidad}</tspan>
    </text>
  </g>
);

const RESUMEN = [
  { texto: "Más presión", color: C.yellow, t: 52.28 },
  { texto: "Agua más caliente", color: C.orange, t: 53.22 },
  { texto: "Comida lista antes", color: C.cyan, t: 54.48 },
];

export const Olla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);

  const cierre = interpolate(t, [T_CIERRE, T_CERRADA], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cerrada = t >= T_CERRADA;
  const temp = temperatura(t);
  const pres = presion(t);
  const agitacion = interpolate(temp, [22, 100, 120], [1, 4, 6]);
  const hierve = t > 3.3 ? Math.min(1, (t - 3.3) / 0.8) : 0;

  // Mecanismos
  const encaje = interpolate(t, [30.38, 31.3], [1, 0], suave); // 1 = garra fuera, 0 = bajo el borde
  const gomaVis = interpolate(t, [32.42, 32.9], [0, 1], clamp);
  const aprieta = interpolate(t, [34.9, 35.6], [0, 1], suave);
  const empujeTapa = interpolate(t, [34.36, 34.9], [0, 1], clamp);
  const peso = t < 42.3 ? 0 : -8 - 5 * Math.abs(Math.sin((t - 42.3) * 16));
  const chorro = interpolate(t, [42.5, 43.1], [0, 1], clamp);
  const seguridad = interpolate(t, [47.4, 47.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const pin = interpolate(t, [49.26, 49.8], [0, 1], suave);
  const bloqueo = interpolate(t, [50.1, 50.5], [0, 1], clamp);
  const card = interpolate(t, [0, 0.4, 23.4, 23.8], [1, 1, 1, 0], clamp) * (t < 24 ? 1 : 0);
  const resumen = interpolate(t, [52.28, 52.7], [0, 1], clamp);

  const tapaY = -700 * (1 - cierre);
  const tapaVisible = interpolate(t, [11.6, 12.1], [0, 1], clamp);
  const tapaRot = -8 * (1 - cierre);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="nube" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="llama" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="interior">
          <rect x={POT.x0 + 7} y={POT.top - 120} width={POT.x1 - POT.x0 - 14} height={POT.bottom - POT.top + 113} rx={36} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {/* Fuego */}
        <rect x={300} y={1440} width={480} height={26} rx={8} fill="#2A2350" />
        {new Array(8).fill(0).map((_, i) => {
          const x = 330 + i * 60;
          const h = 36 + 10 * Math.sin(t * 13 + i * 1.7);
          return (
            <g key={i} filter="url(#llama)">
              <path d={`M ${x - 14} 1440 Q ${x} ${1440 - h * 1.6} ${x + 14} 1440 Z`} fill={C.orange} opacity={0.85} />
              <path d={`M ${x - 7} 1440 Q ${x} ${1440 - h * 0.8} ${x + 7} 1440 Z`} fill="#4C8CFF" />
            </g>
          );
        })}

        {/* Cuerpo de la olla */}
        <rect x={POT.x0} y={POT.top} width={POT.x1 - POT.x0} height={POT.bottom - POT.top} rx={40} fill="#120F28" stroke={METAL} strokeWidth={14} />
        <rect x={POT.x0 - 60} y={1030} width={60} height={22} rx={10} fill={METAL} />
        <rect x={POT.x1} y={1030} width={60} height={22} rx={10} fill={METAL} />
        <rect x={POT.x0 - 14} y={POT.top - 6} width={POT.x1 - POT.x0 + 28} height={12} rx={4} fill={METAL} />

        <g clipPath="url(#interior)">
          {/* Agua */}
          <path
            d={`M ${AGUA.x0} ${AGUA.y} ${new Array(14)
              .fill(0)
              .map((_, k) => `L ${AGUA.x0 + ((k + 1) * (AGUA.x1 - AGUA.x0)) / 14} ${AGUA.y + 4 * Math.sin(t * 5 + k) * (0.3 + hierve)}`)
              .join(" ")} L ${AGUA.x1} ${AGUA.bottom} L ${AGUA.x0} ${AGUA.bottom} Z`}
            fill="rgba(8, 216, 232, 0.16)"
          />
          {MOLECULAS.map((m, i) => (
            <circle
              key={i}
              cx={m.x + agitacion * 3 * Math.sin(t * (4 + agitacion) + m.f)}
              cy={m.y + agitacion * 3 * Math.cos(t * (5 + agitacion) + m.f * 1.3)}
              r={6}
              fill={C.cyan}
              opacity={0.7}
            />
          ))}
          {/* Burbujas de ebullición */}
          {hierve > 0
            ? BURBUJAS.map((b, i) => {
                const p = (t * 0.9 + b.fase) % 1;
                return (
                  <circle
                    key={i}
                    cx={b.x + 6 * Math.sin(p * 9)}
                    cy={AGUA.bottom - 10 - p * (AGUA.bottom - AGUA.y - 10)}
                    r={4 + 9 * p}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    opacity={0.5 * hierve * (1 - p * 0.5)}
                  />
                );
              })
            : null}
          {/* Vapor atrapado dentro con la olla cerrada */}
          {cerrada
            ? VAPOR.map((v, i) => {
                const visible = interpolate(t, [12.9 + i * 0.12, 13.2 + i * 0.12], [0, 1], clamp);
                const x = v.x + 40 * Math.sin(t * v.fx * 3 + v.fase * 6);
                const y = 1095 + 70 * Math.sin(t * v.fy * 3 + v.fase * 9);
                return <circle key={i} cx={x} cy={y} r={6} fill="#FFFFFF" opacity={0.75 * visible} />;
              })
            : null}
          {/* La presión empuja hacia abajo: a las moléculas les cuesta escapar */}
          {t > 18.4 && t < 24
            ? [360, 470, 610, 720].map((x, i) => (
                <Flecha key={i} x={x} y={1120} dir={-1} o={interpolate(t, [18.6, 19.2, 23.3, 23.8], [0, 1, 1, 0], clamp)} s={0.9} />
              ))
            : null}
        </g>

        {/* Vapor que escapa con la olla abierta */}
        {!cerrada || cierre < 1
          ? VAPOR.map((v, i) => {
              const p = (t * 0.45 + v.fase) % 1;
              const y = AGUA.y - p * 520;
              const o = hierve * (1 - p) * (1 - cierre) * (y < POT.top - 10 || cierre < 0.1 ? 1 : 0);
              return <circle key={i} cx={v.x + 30 * Math.sin(p * 6 + i)} cy={y} r={6 + 4 * p} fill="#FFFFFF" opacity={0.7 * o} />;
            })
          : null}

        {/* Tapa con válvulas, seguro, garras y goma */}
        <g transform={`translate(0 ${tapaY}) rotate(${tapaRot} 540 1000)`} opacity={tapaVisible}>
          <path d={`M ${POT.x0 - 6} 992 Q 540 900 ${POT.x1 + 6} 992 Z`} fill="#1A1636" stroke={METAL} strokeWidth={12} strokeLinejoin="round" />
          <rect x={POT.x0 - 20} y={984} width={POT.x1 - POT.x0 + 40} height={10} rx={4} fill={METAL} />
          {/* Garras del encaje giratorio (izquierda y derecha) */}
          <g transform={`translate(${30 * encaje} 0)`} opacity={1 - 0.6 * encaje}>
            <path d="M 846 984 L 858 984 L 858 1014 L 832 1014 L 832 1008 L 846 1008 Z" fill={METAL} />
          </g>
          <g transform={`translate(${-30 * encaje} 0)`} opacity={1 - 0.6 * encaje}>
            <path d="M 234 984 L 222 984 L 222 1014 L 248 1014 L 248 1008 L 234 1008 Z" fill={METAL} />
          </g>
          {/* Goma de empaque (sección) */}
          <ellipse cx={813} cy={991} rx={7 + 2 * aprieta} ry={7 - 2 * aprieta} fill={GOMA} opacity={0.55 + 0.45 * gomaVis} />
          <ellipse cx={267} cy={991} rx={7 + 2 * aprieta} ry={7 - 2 * aprieta} fill={GOMA} opacity={0.55 + 0.45 * gomaVis} />
          {gomaVis > 0 ? <circle cx={813} cy={991} r={16} fill="none" stroke={C.yellow} strokeWidth={2} opacity={gomaVis * (1 - aprieta * 0.5)} /> : null}
          {/* Válvula de peso */}
          <rect x={533} y={905} width={14} height={38} fill={METAL} />
          <g transform={`translate(0 ${peso})`}>
            <rect x={516} y={872} width={48} height={33} rx={7} fill={METAL} />
            <rect x={532} y={860} width={16} height={14} rx={4} fill={METAL} />
          </g>
          {/* Válvula de seguridad */}
          <rect x={683} y={944} width={14} height={18} fill={METAL} />
          <rect x={679} y={936 - 12 * seguridad} width={22} height={9} rx={3} fill={seguridad > 0.5 ? C.red : METAL} />
          {/* Seguro de la tapa */}
          <rect x={391} y={946 - 14 * pin} width={8} height={16} rx={2} fill={pin > 0.5 ? C.red : METAL} />
        </g>

        {/* Vapor por la válvula de peso y por la de seguridad */}
        {chorro > 0
          ? new Array(8).fill(0).map((_, i) => {
              const p = (t * 1.6 + i / 8) % 1;
              return <Nube key={i} x={540 + (i % 2 ? 1 : -1) * (18 + 40 * p)} y={900 - 80 * p} r={6 + 14 * p} o={0.55 * chorro * (1 - p)} />;
            })
          : null}
        {seguridad > 0 && t < 49.2
          ? new Array(6).fill(0).map((_, i) => {
              const p = (t * 2 + i / 6) % 1;
              return <Nube key={i} x={690 + 8 * Math.sin(i)} y={925 - 110 * p} r={5 + 12 * p} o={0.6 * seguridad * (1 - p)} />;
            })
          : null}
        {/* Empuje del vapor sobre la tapa (aprieta la goma) */}
        {empujeTapa > 0 && t < 37.4
          ? [770, 795].map((x) => <Flecha key={x} x={x} y={1060} dir={1} o={empujeTapa} s={0.5} />)
          : null}
        {/* Candado del seguro e intento de giro bloqueado */}
        {bloqueo > 0 ? (
          <g opacity={bloqueo}>
            <rect x={383} y={900} width={24} height={20} rx={4} fill={C.red} />
            <path d="M 388 900 L 388 892 Q 395 882 402 892 L 402 900" fill="none" stroke={C.red} strokeWidth={4} />
            <path d="M 420 930 Q 445 915 440 890" fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="5 4" opacity={0.7} />
            <g stroke={C.red} strokeWidth={4} strokeLinecap="round" opacity={interpolate(t, [50.7, 50.9], [0, 1], clamp)}>
              <line x1={428} y1={896} x2={446} y2={914} />
              <line x1={446} y1={896} x2={428} y2={914} />
            </g>
          </g>
        ) : null}
      </g>

      {/* Tarjeta: temperatura y presión */}
      {card > 0 ? (
        <g opacity={card}>
          <rect x={60} y={150} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <Lectura x={110} titulo="temperatura" valor={`${Math.round(temp)}`} unidad="°C" color={temp > 100.5 ? C.orange : C.yellow} />
          <Lectura x={580} titulo="presión" valor={pres.toFixed(1).replace(".", ",")} unidad="atm" color={C.cyan} />
        </g>
      ) : null}

      {/* Resumen final: lista numerada que se ilumina */}
      {resumen > 0 ? (
        <g opacity={resumen}>
          <rect x={60} y={150} width={960} height={430} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          {RESUMEN.map((r, k) => {
            const a = interpolate(t, [r.t, r.t + 0.3], [0.25, 1], clamp);
            const y = 250 + k * 120;
            return (
              <g key={k} opacity={a}>
                <circle cx={135} cy={y} r={28} fill={a > 0.5 ? r.color : C.grey} />
                <text x={135} y={y + 11} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={30} fontWeight={700}>{k + 1}</text>
                <text x={190} y={y + 17} fill={r.color} fontFamily={mono} fontSize={52} fontWeight={700}>{r.texto}</text>
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
};
