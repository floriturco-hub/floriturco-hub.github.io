import { random } from "remotion";
import { C, mono } from "../theme";

// Trocito de caramelo con burbujas dentro; disolver 0..1 adelgaza las paredes y las revienta
export const Trocito: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly disolver: number; readonly color?: string; readonly id: string }> = ({ x, y, s = 1, t, disolver, color = "#E86AA8", id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 -60 L -60 -150 L 90 -130 L 160 -20 L 120 120 L -40 160 L -150 70 Z" fill={color} stroke="#A83A78" strokeWidth={6} opacity={1 - 0.6 * disolver} />
    {new Array(14).fill(0).map((_, k) => {
      const bx = -110 + random(`${id}bx${k}`) * 230;
      const by = -110 + random(`${id}by${k}`) * 230;
      const r = 12 + random(`${id}br${k}`) * 14;
      const umbral = random(`${id}bu${k}`);
      const revienta = disolver > umbral;
      const f = revienta ? Math.min(1, (disolver - umbral) * 6) : 0;
      return revienta ? (
        <g key={k} opacity={1 - f}>
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const a = (j / 6) * Math.PI * 2;
            return <line key={j} x1={bx + Math.cos(a) * r} y1={by + Math.sin(a) * r} x2={bx + Math.cos(a) * (r + 30 * f)} y2={by + Math.sin(a) * (r + 30 * f)} stroke={C.yellow} strokeWidth={5} />;
          })}
        </g>
      ) : (
        <g key={k}>
          <circle cx={bx} cy={by} r={r * (1 + 0.04 * Math.sin(t * 9 + k))} fill="#FFFFFF" opacity={0.85} />
          <circle cx={bx} cy={by} r={r} fill="none" stroke="#A83A78" strokeWidth={3 + 6 * (1 - disolver)} />
        </g>
      );
    })}
  </g>
);

// Olla de jarabe con CO2 a presión y manómetro
export const Olla: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly presion: number; readonly gas: number }> = ({ x, y, t, presion, gas }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-260} y={-160} width={520} height={360} rx={30} fill="#8A8E9A" stroke="#5A5E6A" strokeWidth={8} />
    <rect x={-230} y={-60} width={460} height={230} rx={20} fill="#E8A040" />
    {gas > 0
      ? new Array(18).fill(0).map((_, k) => {
          const f = (t * 0.5 + random(`og${k}`)) % 1;
          return <circle key={k} cx={-200 + random(`ox${k}`) * 400} cy={160 - f * 210} r={8} fill="#FFFFFF" opacity={gas * 0.8} />;
        })
      : null}
    <rect x={-280} y={-200} width={560} height={50} rx={14} fill="#5A5E6A" />
    <g transform="translate(180 -260)">
      <circle r={70} fill="#F4F2EC" stroke="#5A5E6A" strokeWidth={8} />
      <line x1={0} y1={0} x2={Math.cos(Math.PI * (0.8 + 1.4 * presion)) * 52} y2={Math.sin(Math.PI * (0.8 + 1.4 * presion)) * 52} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
      <text y={110} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>{`x${Math.round(40 * presion)}`}</text>
    </g>
    <rect x={-80} y={-260} width={60} height={70} rx={10} fill="#5A5E6A" />
    <text x={-50} y={-280} textAnchor="middle" fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700}>CO2</text>
  </g>
);

// Sobre de peta zetas
export const Sobre: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -140 -200 L 140 -200 L 130 200 L -130 200 Z" fill="#7A3AC8" stroke="#4A1A88" strokeWidth={6} />
    <path d="M -140 -200 L -120 -220 L -100 -200 L -80 -220 L -60 -200 L -40 -220 L -20 -200 L 0 -220 L 20 -200 L 40 -220 L 60 -200 L 80 -220 L 100 -200 L 120 -220 L 140 -200" fill="#7A3AC8" stroke="#4A1A88" strokeWidth={4} />
    <text y={-20} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={54} fontWeight={700}>POP!</text>
    {[0, 1, 2, 3, 4].map((k) => (
      <path key={k} d={`M ${-80 + k * 40} ${80 + (k % 2) * 30} l 20 -14 l 14 22 l -26 10 Z`} fill="#E86AA8" />
    ))}
  </g>
);
