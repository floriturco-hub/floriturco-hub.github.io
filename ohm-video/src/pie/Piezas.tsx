import { random } from "remotion";
import { C, mono } from "../theme";

// Zapato de lado
export const Zapato: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly color?: string }> = ({ x, y, s = 1, color = "#8A5A32" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 40 L -200 -70 Q -190 -110 -140 -100 L -60 -80 Q 0 -40 80 -30 Q 190 -20 210 30 L 210 60 L -200 60 Z" fill={color} stroke="#5A3A1E" strokeWidth={6} />
    <rect x={-210} y={56} width={430} height={26} rx={10} fill="#2A1A10" />
    {[0, 1, 2].map((k) => (
      <line key={k} x1={-120 + k * 34} y1={-86 + k * 8} x2={-96 + k * 34} y2={-60 + k * 8} stroke="#F4ECE0" strokeWidth={6} strokeLinecap="round" />
    ))}
  </g>
);

// Mano abierta (palma) con índice y anular resaltados
export const Mano: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly resalte: number }> = ({ x, y, s = 1, resalte }) => {
  // pulgar, índice, medio, anular, meñique: [x, largo]
  const dedos: [number, number, string][] = [
    [-120, 150, "#3A3360"],
    [-62, 230, C.cyan],
    [0, 260, "#3A3360"],
    [62, 245, C.yellow],
    [118, 190, "#3A3360"],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {dedos.map(([dx, largo, color], k) => {
        const rot = k === 0 ? -38 : (k - 2) * 6;
        const destacado = (k === 1 || k === 3) && resalte > 0;
        return (
          <g key={k} transform={`rotate(${rot} ${dx} ${k === 0 ? 60 : -40})`}>
            <rect x={dx - 26} y={(k === 0 ? 60 : -40) - largo} width={52} height={largo + 30} rx={26} fill={destacado ? color : "#3A3360"} fillOpacity={destacado ? 0.25 + 0.6 * resalte : 1} stroke={destacado ? color : "#8C88A8"} strokeWidth={destacado ? 6 : 5} />
          </g>
        );
      })}
      <path d="M -150 -40 Q -160 160 -60 220 L 80 220 Q 170 150 150 -40 Z" fill="#3A3360" stroke="#8C88A8" strokeWidth={6} />
    </g>
  );
};

// Gráfica de dispersión con pendiente opcional
export const Dispersion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly n: number;
  readonly pendiente: number;
  readonly ruido: number;
  readonly p: number;
  readonly ejeX: string;
  readonly ejeY: string;
  readonly semilla: string;
  readonly linea: number;
}> = ({ x, y, w, h, n, pendiente, ruido, p, ejeX, ejeY, semilla, linea }) => {
  const x0 = x + 70;
  const y0 = y + h - 60;
  const ancho = w - 110;
  const alto = h - 130;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <line x1={x0} y1={y0} x2={x0 + ancho} y2={y0} stroke={C.grey} strokeWidth={3} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - alto} stroke={C.grey} strokeWidth={3} />
      <text x={x0 + ancho} y={y0 + 40} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>{ejeX}</text>
      <text x={x0 - 10} y={y + 50} fill={C.grey} fontFamily={mono} fontSize={26}>{ejeY}</text>
      {new Array(Math.round(n * p)).fill(0).map((_, k) => {
        const u = random(`${semilla}x${k}`);
        const v = Math.min(1, Math.max(0, 0.5 + pendiente * (u - 0.5) + (random(`${semilla}y${k}`) - 0.5) * ruido));
        return <circle key={k} cx={x0 + 10 + u * (ancho - 20)} cy={y0 - 10 - v * (alto - 20)} r={7} fill={C.white} opacity={0.75} />;
      })}
      {linea > 0 ? (
        <line
          x1={x0 + 10}
          y1={y0 - 10 - (0.5 - pendiente * 0.5) * (alto - 20)}
          x2={x0 + 10 + (ancho - 20) * linea}
          y2={y0 - 10 - (0.5 - pendiente * 0.5 + pendiente * linea) * (alto - 20)}
          stroke={C.yellow}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
};

// Hélice de ADN
export const ADN: React.FC<{ readonly x: number; readonly y: number; readonly h: number; readonly t: number }> = ({ x, y, h, t }) => (
  <g>
    {new Array(16).fill(0).map((_, k) => {
      const yy = y + (k / 15) * h;
      const f = k * 0.5 + t * 2;
      const a = Math.sin(f) * 90;
      return (
        <g key={k}>
          <line x1={x - a} y1={yy} x2={x + a} y2={yy} stroke={C.grey} strokeWidth={4} opacity={0.6} />
          <circle cx={x - a} cy={yy} r={12} fill={C.cyan} />
          <circle cx={x + a} cy={yy} r={12} fill={C.purpleLight} />
        </g>
      );
    })}
  </g>
);

// Regla con marcador
export const Regla: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly marca: number; readonly p: number }> = ({ x, y, w, marca, p }) => {
  const esc = w / 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={110} rx={12} fill="#F4D890" stroke="#B8904A" strokeWidth={5} />
      {new Array(21).fill(0).map((_, k) => (
        <g key={k}>
          <line x1={x + k * esc} y1={y} x2={x + k * esc} y2={y + (k % 5 === 0 ? 50 : 30)} stroke="#5A3A1E" strokeWidth={4} />
          {k % 5 === 0 ? (
            <text x={x + k * esc} y={y + 86} textAnchor="middle" fill="#5A3A1E" fontFamily={mono} fontSize={28} fontWeight={700}>{k}</text>
          ) : null}
        </g>
      ))}
      <g transform={`translate(${x + marca * esc * p} ${y - 20})`}>
        <path d="M -24 -40 L 24 -40 L 0 0 Z" fill={C.yellow} />
        <text x={0} y={-60} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={48} fontWeight={700}>
          {(marca * p).toFixed(1).replace(".", ",")} cm
        </text>
      </g>
    </g>
  );
};
