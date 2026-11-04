import { interpolateColors } from "remotion";
import { C, mono } from "../theme";

export const LATON = "#E8B848";
export const ACERO = "#9AA4B8";

// Puntos de la tira curvada: anclada en (x0,y0), longitud L, curva hacia abajo con ángulo total theta (rad)
const linea = (x0: number, y0: number, L: number, theta: number, d: number) => {
  const n = 40;
  const pts: [number, number][] = [];
  let x = x0;
  let y = y0;
  for (let i = 0; i <= n; i++) {
    const a = (theta * i) / n;
    pts.push([x - Math.sin(a) * d, y + Math.cos(a) * d]);
    x += (Math.cos(a) * L) / n;
    y += (Math.sin(a) * L) / n;
  }
  return pts;
};
export const puntaTira = (x0: number, y0: number, L: number, theta: number) => {
  const p = linea(x0, y0, L, theta, 0);
  return p[p.length - 1];
};

// Tira bimetálica: latón arriba, acero abajo. theta > 0 la curva hacia el acero (abajo).
export const Tira: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly L: number;
  readonly theta: number;
  readonly h?: number;
  readonly etiquetas?: number;
  readonly calor?: number;
}> = ({ x, y, L, theta, h = 26, etiquetas = 0, calor = 0 }) => {
  const capa = (d1: number, d2: number) => {
    const a = linea(x, y, L, theta, d1);
    const b = linea(x, y, L, theta, d2).reverse();
    return `M ${[...a, ...b].map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L ")} Z`;
  };
  const brillo = interpolateColors(calor, [0, 1], ["#00000000", "#E8414F55"]);
  const [mx, my] = linea(x, y, L, theta, -h)[20];
  const [ax, ay] = linea(x, y, L, theta, h)[20];
  return (
    <g>
      <rect
        x={x - 70}
        y={y - h - 30}
        width={70}
        height={2 * h + 60}
        rx={10}
        fill="#3A3360"
        stroke="#8C88A8"
        strokeWidth={5}
      />
      <path d={capa(-h, 0)} fill={LATON} stroke="#A07818" strokeWidth={3} />
      <path d={capa(0, h)} fill={ACERO} stroke="#5A6478" strokeWidth={3} />
      <path d={capa(-h, h)} fill={brillo} />
      {etiquetas > 0 ? (
        <g opacity={etiquetas} fontFamily={mono} fontWeight={700} fontSize={34}>
          <text x={mx} y={my - 24} textAnchor="middle" fill={LATON}>
            latón
          </text>
          <text x={ax} y={ay + 50} textAnchor="middle" fill={ACERO}>
            acero
          </text>
        </g>
      ) : null}
    </g>
  );
};

// Barras de dilatación: latón crece más que el acero
export const Dilatacion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly p: number;
}> = ({ x, y, w, p }) => (
  <g>
    {[
      [LATON, "latón", 0.19],
      [ACERO, "acero", 0.12],
    ].map(([color, nombre, k], i) => {
      const extra = w * (k as number) * p;
      const yy = y + i * 150;
      return (
        <g key={nombre as string}>
          <rect
            x={x}
            y={yy}
            width={w + extra}
            height={60}
            rx={10}
            fill={color as string}
          />
          <line
            x1={x + w}
            y1={yy - 20}
            x2={x + w}
            y2={yy + 80}
            stroke={C.white}
            strokeWidth={4}
            strokeDasharray="8 8"
            opacity={0.6}
          />
          <text
            x={x}
            y={yy - 16}
            fill={color as string}
            fontFamily={mono}
            fontSize={32}
            fontWeight={700}
          >
            {nombre}
          </text>
          {p > 0.05 ? (
            <path
              d={`M ${x + w + 10} ${yy + 30} L ${x + w + extra - 6} ${yy + 30} M ${x + w + extra - 22} ${yy + 16} L ${x + w + extra - 6} ${yy + 30} L ${x + w + extra - 22} ${yy + 44}`}
              stroke={C.white}
              strokeWidth={6}
              fill="none"
            />
          ) : null}
        </g>
      );
    })}
  </g>
);

// Plancha de ropa (vista lateral)
export const Plancha: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly calor: number;
  readonly luz?: boolean;
  readonly perilla?: number;
}> = ({ x, y, s = 1, calor, luz = false, perilla = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -300 60 Q -300 -40 -200 -60 L 220 -60 Q 300 -60 330 60 Z"
      fill="#3A6A9A"
      stroke="#8CB0D8"
      strokeWidth={6}
    />
    <path
      d="M -310 60 L 340 60 L 330 90 L -300 90 Z"
      fill={interpolateColors(calor, [0, 1], ["#B8BCC8", "#E8414F"])}
      stroke="#8C88A8"
      strokeWidth={4}
    />
    {calor > 0.3
      ? [0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d={`M ${-200 + k * 140} 120 q 15 20 0 40 q -15 20 0 40`}
            stroke={C.orange}
            strokeWidth={6}
            fill="none"
            opacity={(calor - 0.3) * 1.4}
          />
        ))
      : null}
    <path
      d="M -180 -60 Q -180 -200 -60 -200 L 160 -200 Q 220 -200 220 -140 L 220 -60"
      fill="none"
      stroke="#2A4A6A"
      strokeWidth={36}
      strokeLinecap="round"
    />
    <g transform={`translate(20 -20) rotate(${perilla})`}>
      <circle r={34} fill="#E8E6F0" stroke="#8C88A8" strokeWidth={4} />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-26}
        stroke={C.red}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </g>
    <circle cx={150} cy={-20} r={14} fill={luz ? C.orange : "#4A4A5A"} />
    <path
      d="M -300 20 Q -380 0 -420 -80"
      stroke="#2A2A3A"
      strokeWidth={14}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

// Contacto eléctrico con circuito y resistencia
export const Circuito: React.FC<{
  readonly tx: number;
  readonly ty: number;
  readonly cx: number;
  readonly cy: number;
  readonly cerrado: boolean;
  readonly t: number;
  readonly chispa: number;
}> = ({ tx, ty, cx, cy, cerrado, t, chispa }) => (
  <g>
    <path
      d={`M ${cx} ${cy + 20} L ${cx} 1360 L 160 1360 L 160 ${ty - 40}`}
      stroke={cerrado ? C.cyan : "#4A4670"}
      strokeWidth={8}
      fill="none"
      strokeDasharray={cerrado ? "20 14" : undefined}
      strokeDashoffset={-t * 120}
    />
    <g transform="translate(540 1360)">
      <rect
        x={-130}
        y={-40}
        width={260}
        height={80}
        rx={14}
        fill={C.card}
        stroke={cerrado ? C.red : C.cardBorder}
        strokeWidth={4}
      />
      <path
        d="M -100 0 l 20 -24 l 30 48 l 30 -48 l 30 48 l 30 -48 l 30 48 l 20 -24"
        stroke={cerrado ? C.red : "#6A6690"}
        strokeWidth={6}
        fill="none"
      />
      <text
        y={80}
        textAnchor="middle"
        fill={cerrado ? C.red : C.grey}
        fontFamily={mono}
        fontSize={30}
        fontWeight={700}
      >
        {cerrado ? "resistencia: ON" : "resistencia: OFF"}
      </text>
    </g>
    <rect x={cx - 40} y={cy} width={80} height={24} rx={6} fill="#C8C4D8" />
    <circle cx={cx} cy={cy} r={12} fill={C.yellow} />
    {chispa > 0
      ? new Array(8).fill(0).map((_, k) => {
          const a = (k / 8) * Math.PI * 2;
          return (
            <line
              key={k}
              x1={cx + Math.cos(a) * 16}
              y1={cy + Math.sin(a) * 16}
              x2={cx + Math.cos(a) * (16 + 40 * chispa)}
              y2={cy + Math.sin(a) * (16 + 40 * chispa)}
              stroke={C.yellow}
              strokeWidth={5}
              opacity={1 - chispa}
            />
          );
        })
      : null}
  </g>
);

// Termostato antiguo: bimetal en espiral con aguja
export const Espiral: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly giro: number;
}> = ({ x, y, giro }) => {
  const pts = new Array(120).fill(0).map((_, i) => {
    const a = (i / 120) * Math.PI * 7;
    const r = 16 + i * 1.5;
    return `${(Math.cos(a + giro * (i / 120)) * r).toFixed(1)} ${(Math.sin(a + giro * (i / 120)) * r).toFixed(1)}`;
  });
  const fin = 7 * Math.PI + giro;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={260} fill="#E8E2D0" stroke="#8C88A8" strokeWidth={8} />
      {new Array(9).fill(0).map((_, k) => {
        const a = ((-140 + k * 35) * Math.PI) / 180;
        return (
          <line
            key={k}
            x1={Math.cos(a) * 220}
            y1={Math.sin(a) * 220}
            x2={Math.cos(a) * 245}
            y2={Math.sin(a) * 245}
            stroke="#5A5478"
            strokeWidth={6}
          />
        );
      })}
      <path
        d={`M ${pts.join(" L ")}`}
        stroke={LATON}
        strokeWidth={14}
        fill="none"
      />
      <path
        d={`M ${pts.join(" L ")}`}
        stroke={ACERO}
        strokeWidth={5}
        fill="none"
      />
      <line
        x1={0}
        y1={0}
        x2={Math.cos(fin) * 200}
        y2={Math.sin(fin) * 200}
        stroke={C.red}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <circle r={16} fill="#3A3360" />
    </g>
  );
};
