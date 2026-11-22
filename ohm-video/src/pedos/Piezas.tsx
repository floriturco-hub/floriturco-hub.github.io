import { random } from "remotion";
import { C, mono } from "../theme";

export const VERDE_OLOR = "#A8D84A";
const AZUFRE = "#F8D848";

// Anillo 99 % / 1 %
export const Anillo: React.FC<{ readonly x: number; readonly y: number; readonly R: number; readonly p: number; readonly resalte: number }> = ({ x, y, R, p, resalte }) => {
  const arco = (f0: number, f1: number) => {
    const a0 = f0 * Math.PI * 2 - Math.PI / 2;
    const a1 = f1 * Math.PI * 2 - Math.PI / 2;
    return `M ${x + Math.cos(a0) * R} ${y + Math.sin(a0) * R} A ${R} ${R} 0 ${f1 - f0 > 0.5 ? 1 : 0} 1 ${x + Math.cos(a1) * R} ${y + Math.sin(a1) * R}`;
  };
  const f = Math.min(0.99, p);
  return (
    <g>
      <circle cx={x} cy={y} r={R} fill="none" stroke={C.wire} strokeWidth={70} />
      {f > 0.001 ? <path d={arco(0, f)} stroke={C.cyan} strokeWidth={70} fill="none" opacity={0.85} /> : null}
      {p >= 0.99 ? <path d={arco(0.99, 1)} stroke={VERDE_OLOR} strokeWidth={70 + 24 * resalte} fill="none" /> : null}
      <text x={x} y={y + 20} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={120} fontWeight={700}>
        {Math.round(f * 100)} %
      </text>
      <text x={x} y={y + 80} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={32}>
        no huele
      </text>
    </g>
  );
};

// Ondas de olor
export const Olor: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly op?: number }> = ({ x, y, s = 1, t, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    {[-40, 0, 40].map((dx, k) => {
      const sube = ((t * 0.8 + k * 0.33) % 1) * 40;
      return <path key={k} d={`M ${dx} ${40 - sube} q 18 -20 0 -40 q -18 -20 0 -40`} stroke={VERDE_OLOR} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9} />;
    })}
  </g>
);

// Moléculas
const Atomo: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly color: string; readonly letra: string }> = ({ x, y, r, color, letra }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={color} stroke="#0B091D" strokeWidth={3} />
    <text x={x} y={y + r * 0.36} textAnchor="middle" fill="#0B091D" fontFamily={mono} fontSize={r * 0.95} fontWeight={700}>
      {letra}
    </text>
  </g>
);

export type Gas = "N2" | "H2" | "CO2" | "CH4" | "H2S";

export const Molecula: React.FC<{ readonly gas: Gas; readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number }> = ({ gas, x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {gas === "N2" ? (
      <g>
        <Atomo x={-22} y={0} r={30} color="#6A8AF0" letra="N" />
        <Atomo x={22} y={0} r={30} color="#6A8AF0" letra="N" />
      </g>
    ) : null}
    {gas === "H2" ? (
      <g>
        <Atomo x={-14} y={0} r={20} color={C.white} letra="H" />
        <Atomo x={14} y={0} r={20} color={C.white} letra="H" />
      </g>
    ) : null}
    {gas === "CO2" ? (
      <g>
        <Atomo x={-46} y={0} r={26} color="#E8414F" letra="O" />
        <Atomo x={46} y={0} r={26} color="#E8414F" letra="O" />
        <Atomo x={0} y={0} r={30} color="#8C88A8" letra="C" />
      </g>
    ) : null}
    {gas === "CH4" ? (
      <g>
        {[0, 90, 180, 270].map((a) => (
          <Atomo key={a} x={Math.cos((a * Math.PI) / 180) * 40} y={Math.sin((a * Math.PI) / 180) * 40} r={18} color={C.white} letra="H" />
        ))}
        <Atomo x={0} y={0} r={30} color="#5A5478" letra="C" />
      </g>
    ) : null}
    {gas === "H2S" ? (
      <g>
        <Atomo x={-36} y={26} r={20} color={C.white} letra="H" />
        <Atomo x={36} y={26} r={20} color={C.white} letra="H" />
        <Atomo x={0} y={0} r={36} color={AZUFRE} letra="S" />
      </g>
    ) : null}
  </g>
);

// Burbuja de gas con moléculas dentro
export const Burbuja: React.FC<{ readonly x: number; readonly y: number; readonly R: number; readonly t: number; readonly gases: Gas[]; readonly visibles: number }> = ({ x, y, R, t, gases, visibles }) => (
  <g>
    <circle cx={x} cy={y} r={R} fill={C.cyan} fillOpacity={0.06} stroke={C.cyan} strokeWidth={5} strokeDasharray="16 12" />
    {gases.slice(0, Math.ceil(gases.length * visibles)).map((g, k) => {
      const a = random(`a${k}`) * Math.PI * 2;
      const d = (0.25 + random(`d${k}`) * 0.55) * R;
      return <Molecula key={k} gas={g} x={x + Math.cos(a + t * 0.3) * d} y={y + Math.sin(a + t * 0.3) * d} s={0.8} rot={t * 40 + k * 30} />;
    })}
  </g>
);

// Tramo de intestino con bacterias que fermentan y producen burbujas
export const Intestino: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly t: number; readonly burbujas: number }> = ({ x, y, w, t, burbujas }) => {
  const d = `M ${x} ${y} C ${x + w * 0.25} ${y - 140} ${x + w * 0.5} ${y + 140} ${x + w * 0.75} ${y} S ${x + w} ${y - 60} ${x + w} ${y - 60}`;
  return (
    <g>
      <path d={d} stroke="#C8607A" strokeWidth={120} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#E890A8" strokeWidth={84} fill="none" strokeLinecap="round" />
      {new Array(10).fill(0).map((_, k) => {
        const u = (k + 0.5) / 10;
        const bx = x + u * w;
        const by = y + Math.sin(u * Math.PI * 2.2) * 40;
        return (
          <g key={k} transform={`translate(${bx} ${by + Math.sin(t * 3 + k) * 6}) rotate(${k * 37})`}>
            <rect x={-16} y={-7} width={32} height={14} rx={7} fill="#7CC84A" />
          </g>
        );
      })}
      {new Array(Math.round(14 * burbujas)).fill(0).map((_, k) => {
        const u = random(`bu${k}`);
        const fase = (t * 0.5 + random(`bf${k}`)) % 1;
        return <circle key={k} cx={x + u * w} cy={y - 10 + Math.sin(u * 7) * 30 - fase * 30} r={6 + random(`br${k}`) * 10} fill="none" stroke={C.cyan} strokeWidth={3} opacity={Math.sin(fase * Math.PI)} />;
      })}
    </g>
  );
};

// Alimentos: frijoles, huevo, carne, brócoli
export const Comida: React.FC<{ readonly tipo: "frijoles" | "huevo" | "carne" | "brocoli"; readonly x: number; readonly y: number; readonly s?: number }> = ({ tipo, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {tipo === "frijoles"
      ? [[-30, -10], [20, -20], [0, 22], [40, 18], [-38, 28]].map(([fx, fy], k) => (
          <path key={k} d={`M ${fx - 22} ${fy} q 0 -20 22 -20 q 22 0 22 20 q 0 18 -14 18 q -8 -8 -16 0 q -14 0 -14 -18 z`} fill="#8A3A2A" stroke="#5A2218" strokeWidth={3} />
        ))
      : null}
    {tipo === "huevo" ? (
      <g>
        <ellipse rx={50} ry={64} fill="#F4ECE0" stroke="#C8B8A0" strokeWidth={4} />
        <path d="M -30 -6 L -12 8 L 4 -10 L 20 6 L 34 -6" stroke="#8A7A60" strokeWidth={4} fill="none" />
      </g>
    ) : null}
    {tipo === "carne" ? (
      <g>
        <path d="M -60 -10 Q -50 -50 0 -46 Q 60 -44 62 0 Q 60 40 10 44 Q -40 46 -56 20 Z" fill="#B8423A" stroke="#7A2A24" strokeWidth={4} />
        <path d="M -30 -20 Q 0 -30 30 -14" stroke="#F4D8C8" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
    {tipo === "brocoli" ? (
      <g>
        <rect x={-12} y={0} width={24} height={60} rx={8} fill="#7CA84A" />
        {[[-30, -10], [0, -30], [30, -10], [-14, 8], [16, 8]].map(([bx, by], k) => (
          <circle key={k} cx={bx} cy={by} r={28} fill="#4A8A3A" stroke="#2E6A2A" strokeWidth={3} />
        ))}
      </g>
    ) : null}
  </g>
);

// Globo con la boca estirada que vibra
export const Globo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly vibra: number }> = ({ x, y, s = 1, t, vibra }) => {
  const amp = 10 * vibra;
  const borde = new Array(9)
    .fill(0)
    .map((_, k) => `${-40 + k * 10} ${70 + Math.sin(t * 60 + k * 1.3) * amp}`)
    .join(" L ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 -260 C 170 -260 190 -60 40 30 L -40 30 C -190 -60 -170 -260 0 -260 Z" fill="#E8703C" stroke="#A84A24" strokeWidth={6} />
      <ellipse cx={-60} cy={-170} rx={30} ry={50} fill="#FFFFFF" opacity={0.25} />
      <path d={`M -40 30 L ${borde} L 40 30 Z`} fill="#C85A2C" stroke="#A84A24" strokeWidth={5} />
      {vibra > 0
        ? [1, 2, 3].map((k) => (
            <path key={k} d={`M ${-30 - k * 30} ${110 + k * 30} Q 0 ${130 + k * 40} ${30 + k * 30} ${110 + k * 30}`} stroke={C.cyan} strokeWidth={6} fill="none" opacity={vibra * (0.9 - k * 0.2) * (0.6 + 0.4 * Math.sin(t * 20 + k))} />
          ))
        : null}
    </g>
  );
};

// Vaso sanguíneo y pulmones: el gas que pasa a la sangre y sale al respirar
export const SangrePulmones: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly p: number }> = ({ x, y, t, p }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -380 260 C -200 260 -200 60 0 60 C 200 60 200 -120 300 -200" stroke="#B8323A" strokeWidth={56} fill="none" strokeLinecap="round" />
    <path d="M -380 260 C -200 260 -200 60 0 60 C 200 60 200 -120 300 -200" stroke="#E8414F" strokeWidth={34} fill="none" strokeLinecap="round" />
    {new Array(6).fill(0).map((_, k) => {
      const u = ((t * 0.35 + k / 6) % 1) * p;
      const bx = -380 + u * 680;
      const by = 260 - u * 460 + Math.sin(u * 6) * 20;
      return <circle key={k} cx={bx} cy={by} r={10} fill="none" stroke={C.cyan} strokeWidth={4} opacity={p > 0 ? 0.9 : 0} />;
    })}
    {/* Pulmones */}
    <g transform="translate(330 -330)">
      <path d="M -20 -80 L -20 20" stroke="#C8B8D8" strokeWidth={16} strokeLinecap="round" />
      <path d="M -30 -10 C -120 -40 -150 60 -130 140 C -110 200 -50 180 -36 120 Z" fill="#E890A8" stroke="#C8607A" strokeWidth={5} />
      <path d="M -10 -10 C 80 -40 110 60 90 140 C 70 200 10 180 -4 120 Z" fill="#E890A8" stroke="#C8607A" strokeWidth={5} />
    </g>
  </g>
);
