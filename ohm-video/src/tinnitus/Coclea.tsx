import { Easing, interpolate, interpolateColors } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { T } from "./tiempos";

// Cóclea: espiral que se desenrolla en una tira con células ciliadas ordenadas por tono
const N = 40;
const ESP = { cx: 540, cy: 1060 };
const TIRA = { x0: 120, x1: 960, y: 1180 };
const CEREBRO = { x: 540, y: 560 };
const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

const espiral = (u: number): [number, number] => {
  const r = 360 - 290 * u;
  const th = -Math.PI / 2 + u * 2.4 * Math.PI * 2;
  return [ESP.cx + r * Math.cos(th), ESP.cy + r * Math.sin(th)];
};
const tira = (u: number): [number, number] => [TIRA.x0 + (TIRA.x1 - TIRA.x0) * u, TIRA.y];
const mezcla = (u: number, p: number): [number, number] => {
  const a = espiral(u);
  const b = tira(u);
  return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
};

export const Cerebro: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly brillo?: number }> = ({ x, y, s = 1, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 ? <ellipse cx={0} cy={0} rx={170} ry={120} fill={C.cyan} opacity={0.2 * brillo} filter="url(#halo-co)" /> : null}
    <path
      d="M -10 -95 C -60 -120 -130 -100 -140 -45 C -175 -30 -170 40 -130 55 C -120 100 -50 110 -10 85 Z M 10 -95 C 60 -120 130 -100 140 -45 C 175 -30 170 40 130 55 C 120 100 50 110 10 85 Z"
      fill="#2A2350"
      stroke={C.purpleLight}
      strokeWidth={6}
    />
    <path d="M -100 -30 Q -60 -60 -40 -20 Q -20 20 -80 30 M 100 -30 Q 60 -60 40 -20 Q 20 20 80 30" fill="none" stroke={C.purpleLight} strokeWidth={5} opacity={0.6} />
  </g>
);

// Iconos de las causas del daño
const Altavoz: React.FC<{ readonly x: number; readonly y: number; readonly o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <rect x={-40} y={-55} width={80} height={110} rx={10} fill="#2A2350" stroke={C.grey} strokeWidth={4} />
    <circle cx={0} cy={-22} r={14} fill="none" stroke={C.grey} strokeWidth={4} />
    <circle cx={0} cy={22} r={22} fill="none" stroke={C.grey} strokeWidth={4} />
  </g>
);
const Auriculares: React.FC<{ readonly x: number; readonly y: number; readonly o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <path d="M -45 20 L -45 0 A 45 45 0 0 1 45 0 L 45 20" fill="none" stroke={C.grey} strokeWidth={8} />
    <rect x={-58} y={10} width={26} height={44} rx={10} fill={C.grey} />
    <rect x={32} y={10} width={26} height={44} rx={10} fill={C.grey} />
  </g>
);
const Reloj: React.FC<{ readonly x: number; readonly y: number; readonly o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <path d="M -30 -50 L 30 -50 L 0 0 L 30 50 L -30 50 L 0 0 Z" fill="none" stroke={C.grey} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -14 38 L 14 38 L 0 18 Z" fill={C.yellow} />
  </g>
);

export const Coclea: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.tono - 0.2, T.tono + 1.4], [0, 1], suave);
  const celulas = interpolate(t, [T.ciliadas - 0.2, T.ciliadas + 0.4], [0, 1], clamp);
  const sonido = interpolate(t, [T.sonido, T.sonido + 0.4, T.ruido - 0.2, T.ruido + 0.2], [0, 1, 1, 0], clamp);
  const avisos = interpolate(t, [T.avisan - 0.2, T.avisan + 0.3, T.ruido - 0.2, T.ruido], [0, 1, 1, 0], clamp);
  const cerebro = interpolate(t, [T.sonido - 0.3, T.sonido + 0.3], [0, 1], clamp);
  const ruido = interpolate(t, [T.ruido, T.ruido + 0.4, T.entonces - 0.4, T.entonces], [0, 1, 1, 0], clamp);
  const zoom = interpolate(t, [T.coclea - 0.2, T.coclea + 1.0, T.entonces], [1.6, 1, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });

  const muerte = (u: number) => (u > 0.3 ? 0 : interpolate(t, [T.danar + (u / 0.3) * 2.8, T.danar + (u / 0.3) * 2.8 + 0.4], [0, 1], clamp));

  // Tubo de la cóclea (se desenrolla con las células)
  const tubo: string[] = [];
  for (let k = 0; k <= 200; k++) {
    const [x, y] = mezcla(k / 200, p);
    tubo.push(`${k === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="halo-co" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 1060 * zoom}) scale(${zoom})`}>
        <path d={tubo.join(" ")} fill="none" stroke="#2A2350" strokeWidth={56} strokeLinecap="round" strokeLinejoin="round" />
        {/* Ruido fuerte que entra por la "entrada" (agudos) */}
        {ruido > 0
          ? [0, 1, 2, 3].map((k) => {
              const q = (t * 0.9 + k / 4) % 1;
              const x = 40 + q * 420;
              return <path key={k} d={`M ${x} ${TIRA.y - 140} Q ${x + 50} ${TIRA.y} ${x} ${TIRA.y + 140}`} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={ruido * (1 - q)} />;
            })
          : null}
        {/* Células ciliadas */}
        {new Array(N).fill(0).map((_, i) => {
          const u = i / (N - 1);
          const [x, y] = mezcla(u, p);
          const amp = sonido * Math.exp(-(((u - 0.55) / 0.1) ** 2));
          const vibra = amp * Math.sin(t * 22 - u * 30);
          const m = muerte(u);
          const color = m > 0.5 ? "#5A5675" : interpolateColors(u, [0, 0.5, 1], [C.yellow, C.orange, C.purpleLight]);
          const giro = (vibra * 35 + m * 75) * (Math.PI / 180);
          const largo = 46 * p;
          return (
            <g key={i} opacity={celulas * (1 - 0.45 * m)}>
              {largo > 2
                ? [-8, 0, 8].map((dx) => (
                    <line
                      key={dx}
                      x1={x + dx}
                      y1={y - 14}
                      x2={x + dx + Math.sin(giro) * largo}
                      y2={y - 14 - Math.cos(giro) * largo}
                      stroke={color}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                  ))
                : null}
              <circle cx={x} cy={y} r={12 + 4 * amp} fill={color} />
            </g>
          );
        })}
        {/* Señales hacia el cerebro */}
        {avisos > 0
          ? new Array(6).fill(0).map((_, k) => {
              const [x0, y0] = tira(0.45 + k * 0.04);
              const q = (t * 1.2 + k / 6) % 1;
              return (
                <g key={k} opacity={avisos}>
                  <line x1={x0} y1={y0 - 70} x2={CEREBRO.x} y2={CEREBRO.y + 90} stroke={C.cyan} strokeWidth={2} opacity={0.35} />
                  <circle cx={x0 + (CEREBRO.x - x0) * q} cy={y0 - 70 + (CEREBRO.y + 90 - y0 + 70) * q} r={9} fill={C.cyan} />
                </g>
              );
            })
          : null}
        {cerebro > 0 ? (
          <g opacity={cerebro}>
            <Cerebro x={CEREBRO.x} y={CEREBRO.y} brillo={avisos} />
          </g>
        ) : null}
        {/* Escala de tonos */}
        <g opacity={interpolate(t, [T.agudos - 0.2, T.agudos + 0.3], [0, 1], clamp)}>
          <text x={TIRA.x0} y={TIRA.y + 110} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>20.000 Hz</text>
        </g>
        <g opacity={interpolate(t, [T.graves - 0.2, T.graves + 0.3], [0, 1], clamp)}>
          <text x={TIRA.x1} y={TIRA.y + 110} textAnchor="middle" fill={C.purpleLight} fontFamily={mono} fontSize={34} fontWeight={700}>20 Hz</text>
        </g>
        {/* Causas */}
        <Altavoz x={180} y={820} o={interpolate(t, [T.concierto - 0.1, T.concierto + 0.3, T.entonces - 0.4, T.entonces], [0, 1, 1, 0], clamp)} />
        <Auriculares x={360} y={820} o={interpolate(t, [T.auriculares - 0.1, T.auriculares + 0.3, T.entonces - 0.4, T.entonces], [0, 1, 1, 0], clamp)} />
        <Reloj x={540} y={820} o={interpolate(t, [T.edad - 0.1, T.edad + 0.3, T.entonces - 0.4, T.entonces], [0, 1, 1, 0], clamp)} />
      </g>
    </svg>
  );
};
