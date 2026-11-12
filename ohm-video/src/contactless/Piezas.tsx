import { C, mono } from "../theme";

// Símbolo contactless (tres arcos)
const Ondas: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly color?: string;
}> = ({ x, y, s = 1, color = C.white }) => (
  <g
    transform={`translate(${x} ${y}) scale(${s})`}
    fill="none"
    stroke={color}
    strokeWidth={6}
    strokeLinecap="round"
  >
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${k * 14} ${-14 - k * 9} Q ${10 + k * 18} 0 ${k * 14} ${14 + k * 9}`}
      />
    ))}
  </g>
);

// Tarjeta bancaria genérica (sin marcas). xray muestra la antena interna; energia hace brillar chip y antena.
export const Tarjeta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly rot?: number;
  readonly xray?: number;
  readonly energia?: number;
  readonly t?: number;
}> = ({ x, y, s = 1, rot = 0, xray = 0, energia = 0, t = 0 }) => {
  const W = 430;
  const H = 270;
  const vueltas = [0, 1, 2, 3];
  const glow = energia * (0.75 + 0.25 * Math.sin(t * 20));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect
        x={-W / 2}
        y={-H / 2}
        width={W}
        height={H}
        rx={24}
        fill="#1E3A6A"
        stroke="#5A8AC8"
        strokeWidth={4}
        opacity={1 - 0.55 * xray}
      />
      <rect
        x={-W / 2}
        y={-H / 2 + 170}
        width={W}
        height={20}
        fill="#2A4A80"
        opacity={1 - xray}
      />
      <g opacity={1 - xray}>
        <text
          x={-W / 2 + 30}
          y={H / 2 - 30}
          fill="#C8D8F0"
          fontFamily={mono}
          fontSize={22}
          letterSpacing={3}
        >
          •••• •••• •••• 4821
        </text>
        <Ondas x={W / 2 - 60} y={-H / 2 + 60} s={0.9} color="#C8D8F0" />
      </g>
      {xray > 0
        ? vueltas.map((k) => (
            <rect
              key={k}
              x={-W / 2 + 18 + k * 9}
              y={-H / 2 + 18 + k * 9}
              width={W - 36 - k * 18}
              height={H - 36 - k * 18}
              rx={16}
              fill="none"
              stroke={energia > 0.05 ? C.cyan : "#C88A3A"}
              strokeWidth={4}
              opacity={xray * (0.6 + 0.4 * (energia > 0.05 ? glow : 1))}
              strokeDasharray={energia > 0.05 ? "18 10" : undefined}
              strokeDashoffset={-t * 160}
            />
          ))
        : null}
      {xray > 0 ? (
        <path
          d={`M ${-W / 2 + 45} ${-40} L ${-W / 2 + 80} ${-20}`}
          stroke={energia > 0.05 ? C.cyan : "#C88A3A"}
          strokeWidth={4}
          opacity={xray}
        />
      ) : null}
      <rect
        x={-W / 2 + 50}
        y={-50}
        width={70}
        height={56}
        rx={10}
        fill={energia > 0.05 ? C.yellow : "#D8B048"}
        stroke="#8A6A18"
        strokeWidth={3}
      />
      <path
        d={`M ${-W / 2 + 50} -22 L ${-W / 2 + 120} -22 M ${-W / 2 + 85} -50 L ${-W / 2 + 85} 6`}
        stroke="#8A6A18"
        strokeWidth={3}
      />
      {glow > 0.05 ? (
        <circle
          cx={-W / 2 + 85}
          cy={-22}
          r={60}
          fill={C.yellow}
          opacity={0.25 * glow}
        />
      ) : null}
    </g>
  );
};

// Datáfono genérico con bobina emisora
export const Datafono: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly pantalla: string;
  readonly color?: string;
}> = ({ x, y, s = 1, pantalla, color = C.white }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-160}
      y={-260}
      width={320}
      height={520}
      rx={40}
      fill="#2A2A3A"
      stroke="#6A6A8A"
      strokeWidth={6}
    />
    <rect x={-120} y={-220} width={240} height={150} rx={14} fill="#0E1A2A" />
    <text
      x={0}
      y={-130}
      textAnchor="middle"
      fill={color}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      {pantalla}
    </text>
    {new Array(12).fill(0).map((_, k) => (
      <rect
        key={k}
        x={-110 + (k % 3) * 80}
        y={-30 + Math.floor(k / 3) * 60}
        width={60}
        height={44}
        rx={10}
        fill="#4A4A5E"
      />
    ))}
    <Ondas x={-14} y={-300} s={1.2} color={C.cyan} />
  </g>
);

// Líneas de campo alternante sobre el datáfono
export const Campo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly op: number;
  readonly hz?: number;
}> = ({ x, y, t, op, hz = 1.2 }) => {
  const fase = Math.sin(t * Math.PI * 2 * hz);
  return (
    <g transform={`translate(${x} ${y})`} opacity={op}>
      {[1, 2, 3, 4].map((k) => (
        <ellipse
          key={k}
          cx={0}
          cy={-k * 70}
          rx={120 + k * 70}
          ry={k * 70}
          fill="none"
          stroke={C.cyan}
          strokeWidth={4}
          opacity={(0.25 + 0.6 * Math.abs(fase)) * (1 - k * 0.15)}
        />
      ))}
      {[1, 2, 3, 4].map((k) => (
        <path
          key={`a${k}`}
          d={
            fase > 0
              ? `M -14 ${-k * 140 + 10} L 0 ${-k * 140 - 10} L 14 ${-k * 140 + 10}`
              : `M -14 ${-k * 140 - 10} L 0 ${-k * 140 + 10} L 14 ${-k * 140 - 10}`
          }
          fill="none"
          stroke={C.cyan}
          strokeWidth={5}
          opacity={0.8}
        />
      ))}
    </g>
  );
};

// Batería tachada
export const BateriaTachada: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <rect
      x={-80}
      y={-40}
      width={150}
      height={80}
      rx={12}
      fill="none"
      stroke={C.white}
      strokeWidth={7}
    />
    <rect x={72} y={-16} width={14} height={32} rx={4} fill={C.white} />
    <rect x={-66} y={-26} width={40} height={52} rx={6} fill={C.red} />
    <line
      x1={-110}
      y1={-80}
      x2={110}
      y2={80}
      stroke={C.red}
      strokeWidth={12}
      strokeLinecap="round"
    />
  </g>
);

// Señal con modulación de carga y bits
export const Modulacion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly p: number;
  readonly t: number;
}> = ({ x, y, w, p, t }) => {
  const bits = [1, 0, 1, 1, 0, 0, 1, 0];
  const n = 240;
  const pts = new Array(n + 1).fill(0).map((_, i) => {
    const u = i / n;
    const b = bits[Math.min(7, Math.floor(u * 8))];
    const amp = b ? 70 : 34;
    return `${(x + u * w * p).toFixed(1)} ${(y + Math.sin(u * 160 + t * 10) * amp).toFixed(1)}`;
  });
  return (
    <g>
      <rect
        x={x - 30}
        y={y - 150}
        width={w + 60}
        height={340}
        rx={22}
        fill={C.card}
        stroke={C.cardBorder}
        strokeWidth={2}
      />
      <path
        d={`M ${pts.join(" L ")}`}
        stroke={C.cyan}
        strokeWidth={4}
        fill="none"
      />
      {bits.map((b, k) =>
        (k + 0.5) / 8 < p ? (
          <text
            key={k}
            x={x + ((k + 0.5) / 8) * w}
            y={y + 150}
            textAnchor="middle"
            fill={b ? C.yellow : C.grey}
            fontFamily={mono}
            fontSize={48}
            fontWeight={700}
          >
            {b}
          </text>
        ) : null,
      )}
    </g>
  );
};

// Intensidad del campo frente a la distancia
export const Distancia: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly p: number;
}> = ({ x, y, w, h, p }) => {
  const x0 = x + 70;
  const y0 = y + h - 70;
  const ancho = w - 110;
  const alto = h - 140;
  const pts = new Array(81).fill(0).map((_, i) => {
    const u = (i / 80) * p;
    const v = 1 / Math.pow(1 + u * 6, 3);
    return `${(x0 + u * ancho).toFixed(1)} ${(y0 - v * alto).toFixed(1)}`;
  });
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={22}
        fill={C.card}
        stroke={C.cardBorder}
        strokeWidth={2}
      />
      <line
        x1={x0}
        y1={y0}
        x2={x0 + ancho}
        y2={y0}
        stroke={C.grey}
        strokeWidth={3}
      />
      <line
        x1={x0}
        y1={y0}
        x2={x0}
        y2={y0 - alto - 10}
        stroke={C.grey}
        strokeWidth={3}
      />
      <text
        x={x0 + ancho}
        y={y0 + 44}
        textAnchor="end"
        fill={C.grey}
        fontFamily={mono}
        fontSize={28}
      >
        distancia
      </text>
      <text
        x={x0 + 10}
        y={y + 50}
        fill={C.grey}
        fontFamily={mono}
        fontSize={28}
      >
        campo
      </text>
      <path
        d={`M ${pts.join(" L ")}`}
        stroke={C.cyan}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x={x0}
        y={y0 - alto}
        width={ancho * 0.12}
        height={alto}
        fill={C.yellow}
        opacity={0.12}
      />
      <text
        x={x0 + ancho * 0.06}
        y={y0 - alto - 14}
        textAnchor="middle"
        fill={C.yellow}
        fontFamily={mono}
        fontSize={26}
        fontWeight={700}
      >
        ~4 cm
      </text>
    </g>
  );
};
