import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { mono } from "../theme";

// Animación horizontal de lluvia y tormenta para dormir, en bucle perfecto.
// Todo movimiento completa un número ENTERO de ciclos en LOOP_FRAMES,
// así el último fotograma enlaza con el primero. El audio (música lo-fi,
// lluvia y truenos) se monta aparte con la misma duración exacta.

export const LOOP_FRAMES = 3292; // 32 compases a 70 BPM (~109,73 s a 30 fps)
const FPS = 30;
const W = 1920;
const H = 1080;
const L = LOOP_FRAMES / FPS;

// Relámpagos (s dentro del bucle); los truenos suenan ~1,3-1,8 s después
const RAYOS = [18, 52, 88];

const COL = {
  cielo1: "#0A0A1E",
  cielo2: "#1C1A3E",
  nube: "#262447",
  nubeLejos: "#1C1B38",
  colina: "#121028",
  colinaLejos: "#17152F",
  ventana: "#F8C27A",
  lluvia: "#9AA8D8",
};

const frac = (x: number) => x - Math.floor(x);

// Intensidad del destello: triple parpadeo rápido que decae
const destello = (t: number) =>
  RAYOS.reduce((acc, r) => {
    const d = t - r;
    if (d < 0 || d > 1.2) return acc;
    const p =
      Math.exp(-((d - 0.0) ** 2) / 0.0015) * 1 +
      Math.exp(-((d - 0.16) ** 2) / 0.002) * 0.6 +
      Math.exp(-((d - 0.38) ** 2) / 0.006) * 0.8;
    return Math.max(acc, p);
  }, 0);

// Nube hecha de círculos
const Nube: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly semilla: string;
}> = ({ x, y, s, color, semilla }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(7).fill(0).map((_, k) => (
      <ellipse
        key={k}
        cx={(k - 3) * 70 + random(`${semilla}x${k}`) * 30}
        cy={-Math.sin((k / 6) * Math.PI) * 50 + random(`${semilla}y${k}`) * 20}
        rx={90 + random(`${semilla}r${k}`) * 50}
        ry={60 + random(`${semilla}q${k}`) * 30}
        fill={color}
      />
    ))}
  </g>
);

// Capa de nubes que recorre n anchos de pantalla por bucle (n entero)
const CapaNubes: React.FC<{
  readonly fase: number;
  readonly n: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly cuantas: number;
  readonly semilla: string;
  readonly op: number;
}> = ({ fase, n, y, s, color, cuantas, semilla, op }) => {
  const off = -frac(fase * n) * W;
  return (
    <g opacity={op}>
      {[0, W].map((dx) => (
        <g key={dx} transform={`translate(${off + dx} 0)`}>
          {new Array(cuantas).fill(0).map((_, k) => (
            <Nube
              key={k}
              x={(k / cuantas) * W + random(`${semilla}p${k}`) * 120}
              y={y + random(`${semilla}h${k}`) * 70}
              s={s * (0.8 + random(`${semilla}s${k}`) * 0.5)}
              color={color}
              semilla={`${semilla}${k}`}
            />
          ))}
        </g>
      ))}
    </g>
  );
};

// Rayo ramificado
const Rayo: React.FC<{
  readonly x: number;
  readonly semilla: string;
  readonly op: number;
}> = ({ x, semilla, op }) => {
  let px = x;
  let py = 120;
  const pts = [`${px},${py}`];
  for (let k = 0; k < 9; k++) {
    px += (random(`${semilla}a${k}`) - 0.5) * 90;
    py += 45 + random(`${semilla}b${k}`) * 30;
    pts.push(`${px},${py}`);
  }
  const rama = pts[4].split(",").map(Number);
  return (
    <g opacity={op}>
      <polyline
        points={pts.join(" ")}
        stroke="#E8ECFF"
        strokeWidth={4}
        fill="none"
        strokeLinejoin="round"
      />
      <polyline
        points={pts.join(" ")}
        stroke="#9AB4FF"
        strokeWidth={14}
        fill="none"
        opacity={0.35}
        strokeLinejoin="round"
      />
      <polyline
        points={`${rama[0]},${rama[1]} ${rama[0] + 60},${rama[1] + 50} ${rama[0] + 70},${rama[1] + 110} ${rama[0] + 120},${rama[1] + 150}`}
        stroke="#E8ECFF"
        strokeWidth={2.5}
        fill="none"
      />
    </g>
  );
};

// Capa de lluvia: cada gota cae un número entero de veces por bucle
const Lluvia: React.FC<{
  readonly fase: number;
  readonly cuantas: number;
  readonly largo: number;
  readonly ancho: number;
  readonly vel: number;
  readonly op: number;
  readonly semilla: string;
}> = ({ fase, cuantas, largo, ancho, vel, op, semilla }) => {
  const inclinacion = 0.18;
  return (
    <g opacity={op}>
      {new Array(cuantas).fill(0).map((_, k) => {
        const ciclos = Math.round(
          vel * (0.85 + random(`${semilla}v${k}`) * 0.3),
        );
        const u = frac(random(`${semilla}u${k}`) + ciclos * fase);
        const y = -largo + u * (H + largo * 2);
        const x = random(`${semilla}x${k}`) * (W + 300) - 150 - y * inclinacion;
        return (
          <line
            key={k}
            x1={x}
            y1={y}
            x2={x - largo * inclinacion}
            y2={y + largo}
            stroke={COL.lluvia}
            strokeWidth={ancho}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// Ondas en los charcos: cada una se repite m veces por bucle
const Ondas: React.FC<{ readonly fase: number }> = ({ fase }) => (
  <g>
    {new Array(26).fill(0).map((_, k) => {
      const m = 30 + Math.floor(random(`om${k}`) * 40);
      const u = frac(random(`ou${k}`) + m * fase);
      const cx = random(`ox${k}`) * W;
      const cy = 990 + random(`oy${k}`) * 70;
      return (
        <ellipse
          key={k}
          cx={cx}
          cy={cy}
          rx={6 + u * 46}
          ry={(6 + u * 46) * 0.22}
          fill="none"
          stroke={COL.lluvia}
          strokeWidth={2}
          opacity={(1 - u) * 0.45}
        />
      );
    })}
  </g>
);

// Casita con ventana encendida
const Casa: React.FC<{ readonly brillo: number }> = ({ brillo }) => (
  <g transform="translate(1340 760)">
    <defs>
      <radialGradient id="halo">
        <stop offset="0" stopColor={COL.ventana} stopOpacity={0.22 * brillo} />
        <stop offset="1" stopColor={COL.ventana} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={65} cy={60} r={230} fill="url(#halo)" />
    <rect x={-40} y={0} width={200} height={140} fill="#0E0C22" />
    <polygon points="-70,10 60,-90 190,10" fill="#0E0C22" />
    <rect x={110} y={-70} width={30} height={60} fill="#0E0C22" />
    <rect
      x={0}
      y={40}
      width={50}
      height={50}
      rx={4}
      fill={COL.ventana}
      opacity={0.85 * brillo}
    />
    <rect
      x={80}
      y={40}
      width={50}
      height={50}
      rx={4}
      fill={COL.ventana}
      opacity={0.75 * brillo}
    />
    <line x1={25} y1={40} x2={25} y2={90} stroke="#0E0C22" strokeWidth={4} />
    <line x1={0} y1={65} x2={50} y2={65} stroke="#0E0C22" strokeWidth={4} />
    <line x1={105} y1={40} x2={105} y2={90} stroke="#0E0C22" strokeWidth={4} />
    <line x1={80} y1={65} x2={130} y2={65} stroke="#0E0C22" strokeWidth={4} />
  </g>
);

export const LluviaLoFi: React.FC = () => {
  const frame = useCurrentFrame();
  const fase = (frame % LOOP_FRAMES) / LOOP_FRAMES; // 0..1
  const t = fase * L;
  const flash = destello(t);
  // Parpadeo suave de la ventana: frecuencias enteras por bucle
  const brillo =
    0.88 +
    0.06 * Math.sin(fase * Math.PI * 2 * 37) +
    0.04 * Math.sin(fase * Math.PI * 2 * 91);
  const rayoActivo = RAYOS.findIndex((r) => t - r >= 0 && t - r < 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: COL.cielo1 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COL.cielo1} />
            <stop offset="1" stopColor={COL.cielo2} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#cielo)" />
        {rayoActivo >= 0 ? (
          <Rayo
            x={[520, 1450, 900][rayoActivo]}
            semilla={`rayo${rayoActivo}`}
            op={Math.min(1, flash * 1.4)}
          />
        ) : null}
        <CapaNubes
          fase={fase}
          n={1}
          y={140}
          s={1.3}
          color={COL.nubeLejos}
          cuantas={6}
          semilla="lejos"
          op={1}
        />
        <CapaNubes
          fase={fase}
          n={2}
          y={60}
          s={1.6}
          color={COL.nube}
          cuantas={5}
          semilla="cerca"
          op={0.95}
        />
        <rect width={W} height={H} fill="#B8C4FF" opacity={flash * 0.22} />
        <Lluvia
          fase={fase}
          cuantas={220}
          largo={26}
          ancho={1.5}
          vel={120}
          op={0.35}
          semilla="far"
        />
        <path
          d={`M 0 820 Q 300 720 640 790 T 1300 760 T 1920 780 L 1920 ${H} L 0 ${H} Z`}
          fill={COL.colinaLejos}
        />
        <path
          d={`M 0 900 Q 420 820 900 880 T 1920 860 L 1920 ${H} L 0 ${H} Z`}
          fill={COL.colina}
        />
        <Casa brillo={brillo} />
        <rect x={0} y={960} width={W} height={120} fill="#0C0A1E" />
        <Ondas fase={fase} />
        <Lluvia
          fase={fase}
          cuantas={130}
          largo={52}
          ancho={2.4}
          vel={160}
          op={0.55}
          semilla="near"
        />
        <rect width={W} height={H} fill="#FFFFFF" opacity={flash * 0.08} />
        <text
          x={W - 40}
          y={H - 36}
          textAnchor="end"
          fill="#E8E6F0"
          opacity={0.18}
          fontFamily={mono}
          fontSize={26}
          fontWeight={700}
        >
          Frecuencia Cero
        </text>
      </svg>
    </AbsoluteFill>
  );
};
