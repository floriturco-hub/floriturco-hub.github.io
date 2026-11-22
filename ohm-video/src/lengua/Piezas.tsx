import { random } from "remotion";
import { C, mono } from "../theme";

export const SABOR = {
  dulce: "#F28CB8",
  salado: "#9CD8F0",
  acido: "#C8E048",
  amargo: "#D08040",
  umami: "#B07CE8",
};
export type Sabor = keyof typeof SABOR;
const ORDEN: Sabor[] = ["dulce", "salado", "acido", "amargo", "umami"];

const CONTORNO =
  "M -225 -360 Q 0 -420 225 -360 Q 290 -100 245 150 Q 200 375 0 395 Q -200 375 -245 150 Q -290 -100 -225 -360 Z";
const dentro = (x: number, y: number) =>
  (x / 235) ** 2 + ((y - 15) / 385) ** 2 < 0.86;

// Puntos (botones gustativos) repartidos por toda la lengua, deterministas
const PUNTOS: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  let k = 0;
  while (out.length < 150 && k < 2000) {
    const x = (random(`lx${k}`) - 0.5) * 500;
    const y = -380 + random(`ly${k}`) * 770;
    if (dentro(x, y)) {
      out.push([x, y, random(`lo${k}`)]);
    }
    k++;
  }
  return out;
})();

// Lengua vista desde arriba: punta abajo, fondo arriba
export const Lengua: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly t?: number;
  readonly zonas?: number; // opacidad del mapa clásico
  readonly res?: Partial<Record<Sabor, number>>; // resalte de cada zona
  readonly bordes?: number; // fronteras de "territorio"
  readonly botones?: number; // fracción de botones gustativos visibles
  readonly mezcla?: number; // botones multicolor
  readonly id: string;
}> = ({
  x,
  y,
  s = 1,
  t = 0,
  zonas = 0,
  res = {},
  bordes = 0,
  botones = 0,
  mezcla = 0,
  id,
}) => {
  const z = (k: Sabor) => zonas * (0.55 + 0.45 * (res[k] ?? 0));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={CONTORNO} />
        </clipPath>
      </defs>
      <path d={CONTORNO} fill="#C8506A" stroke="#E87890" strokeWidth={6} />
      <g clipPath={`url(#clip-${id})`}>
        <ellipse
          cx={0}
          cy={-300}
          rx={280}
          ry={125}
          fill={SABOR.amargo}
          opacity={z("amargo")}
        />
        {[-1, 1].map((l) => (
          <g key={l}>
            <ellipse
              cx={l * 215}
              cy={-55}
              rx={85}
              ry={130}
              fill={SABOR.acido}
              opacity={z("acido")}
            />
            <ellipse
              cx={l * 205}
              cy={165}
              rx={85}
              ry={110}
              fill={SABOR.salado}
              opacity={z("salado")}
            />
          </g>
        ))}
        <ellipse
          cx={0}
          cy={345}
          rx={190}
          ry={95}
          fill={SABOR.dulce}
          opacity={z("dulce")}
        />
        {bordes > 0 ? (
          <g
            stroke={C.bg}
            strokeWidth={7}
            fill="none"
            strokeDasharray="18 12"
            opacity={bordes}
          >
            <ellipse cx={0} cy={-300} rx={280} ry={125} />
            {[-1, 1].map((l) => (
              <g key={l}>
                <ellipse cx={l * 215} cy={-55} rx={85} ry={130} />
                <ellipse cx={l * 205} cy={165} rx={85} ry={110} />
              </g>
            ))}
            <ellipse cx={0} cy={345} rx={190} ry={95} />
          </g>
        ) : null}
        {/* surco central */}
        <path
          d="M 0 -340 Q 8 -40 0 260"
          stroke="#A03850"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
        {botones > 0
          ? PUNTOS.map(([px, py, o], k) => {
              if (o > botones) {
                return null;
              }
              const color = mezcla > 0 ? SABOR[ORDEN[k % 5]] : "#F8D0DA";
              const late = 0.75 + 0.25 * Math.sin(t * 3 + k);
              return (
                <circle
                  key={k}
                  cx={px}
                  cy={py}
                  r={9 + 2 * late * mezcla}
                  fill={color}
                  opacity={0.9}
                />
              );
            })
          : null}
      </g>
    </g>
  );
};

// Dedos pellizcando y cristales de azúcar que caen
export const Pizca: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly caida: number;
  readonly op?: number;
  readonly dist?: number;
}> = ({ x, y, caida, op = 1, dist = 220 }) => (
  <g opacity={op}>
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-78}
        y={-260}
        width={70}
        height={230}
        rx={35}
        fill="#E8B898"
        stroke="#B8886A"
        strokeWidth={5}
        transform="rotate(-14 -43 -30)"
      />
      <rect
        x={8}
        y={-250}
        width={70}
        height={220}
        rx={35}
        fill="#E8B898"
        stroke="#B8886A"
        strokeWidth={5}
        transform="rotate(14 43 -30)"
      />
      <rect
        x={-30}
        y={-46}
        width={60}
        height={22}
        rx={8}
        fill="#FFFFFF"
        opacity={1 - caida}
      />
    </g>
    {caida > 0
      ? new Array(16).fill(0).map((_, k) => {
          const d = Math.min(
            1,
            Math.max(0, caida * 1.6 - random(`az${k}`) * 0.6),
          );
          if (d <= 0) {
            return null;
          }
          const px = x + (random(`ax${k}`) - 0.5) * 40 * (1 + d);
          const py = y - 30 + d * d * dist;
          return (
            <rect
              key={k}
              x={px - 6}
              y={py - 6}
              width={12}
              height={12}
              fill="#FFFFFF"
              transform={`rotate(${k * 37} ${px} ${py})`}
            />
          );
        })
      : null}
  </g>
);

// Gráfica de sensibilidad: mismos datos, distinta escala vertical
export const Grafica: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly amp: number;
  readonly p: number;
  readonly titulo: string;
  readonly escala: string;
}> = ({ x, y, w, h, amp, p, titulo, escala }) => {
  const x0 = x + 80;
  const y0 = y + h - 80;
  const ancho = w - 130;
  const perfiles: [Sabor, number[]][] = [
    ["dulce", [1, 0.5, 0.2, 0.1, 0.2]],
    ["salado", [0.6, 1, 0.5, 0.2, 0.3]],
    ["acido", [0.2, 0.5, 1, 0.5, 0.3]],
    ["amargo", [0.3, 0.2, 0.3, 0.6, 1]],
  ];
  const mid = y + 120 + (h - 220) / 2;
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
      <text
        x={x + 34}
        y={y + 56}
        fill={C.white}
        fontFamily={mono}
        fontSize={32}
        fontWeight={700}
      >
        {titulo}
      </text>
      <text
        x={x0 - 14}
        y={y + 112}
        fill={C.grey}
        fontFamily={mono}
        fontSize={24}
      >
        sensibilidad ({escala})
      </text>
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
        y2={y + 130}
        stroke={C.grey}
        strokeWidth={3}
      />
      {["punta", "lados", "fondo"].map((r, i) => (
        <text
          key={r}
          x={x0 + ancho * (i === 0 ? 0.04 : i === 1 ? 0.5 : 0.96)}
          y={y0 + 40}
          textAnchor="middle"
          fill={C.grey}
          fontFamily={mono}
          fontSize={24}
        >
          {r}
        </text>
      ))}
      {perfiles.map(([sabor, v], k) => {
        const pts = new Array(41).fill(0).map((_, i) => {
          const u = i / 40;
          const f = u * 4;
          const a = Math.min(3, Math.floor(f));
          const b = f - a;
          const val = v[a] * (1 - b) + v[a + 1] * b;
          return `${x0 + 10 + u * (ancho - 20) * p} ${mid - (val - 0.5) * amp + (k - 1.5) * 4}`;
        });
        return (
          <path
            key={sabor}
            d={`M ${pts.join(" L ")}`}
            stroke={SABOR[sabor]}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
};

// Libro de texto abierto
export const Libro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly children?: React.ReactNode;
}> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -440 -300 Q -220 -340 0 -290 L 0 320 Q -220 270 -440 310 Z"
      fill="#F0E8D8"
      stroke="#B8A888"
      strokeWidth={6}
    />
    <path
      d="M 440 -300 Q 220 -340 0 -290 L 0 320 Q 220 270 440 310 Z"
      fill="#F4ECDC"
      stroke="#B8A888"
      strokeWidth={6}
    />
    {new Array(9).fill(0).map((_, k) => (
      <line
        key={k}
        x1={-390}
        y1={-220 + k * 56}
        x2={k % 3 === 2 ? -170 : -50}
        y2={-226 + k * 56}
        stroke="#B8A888"
        strokeWidth={10}
        strokeLinecap="round"
      />
    ))}
    {children}
  </g>
);

const BOTON =
  "M 0 -250 C 170 -240 230 -40 200 100 C 170 230 -170 230 -200 100 C -230 -40 -170 -240 0 -250 Z";

// Botón gustativo: "cebolla" de células, con un poro arriba
export const BotonGustativo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly t: number;
  readonly luces: Partial<Record<Sabor, number>>;
}> = ({ x, y, s = 1, t, luces }) => {
  const n = 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="clip-boton">
          <path d={BOTON} />
        </clipPath>
      </defs>
      <path d={BOTON} fill="#7A2E44" />
      <g clipPath="url(#clip-boton)">
        {new Array(n).fill(0).map((_, k) => {
          const u = (k + 0.5) / n;
          const ang = -70 + u * 140;
          const sabor = ORDEN[k % 5];
          const luz = luces[sabor] ?? 0;
          const glow = luz * (0.8 + 0.2 * Math.sin(t * 8 + k));
          return (
            <g key={k} transform={`rotate(${ang * 0.42} 0 180)`}>
              <path
                d="M -18 170 C -30 60 -16 -120 0 -200 C 16 -120 30 60 18 170 Z"
                fill={SABOR[sabor]}
                opacity={0.35 + 0.65 * glow}
                stroke={luz > 0 ? C.white : "none"}
                strokeWidth={3}
              />
              <line
                x1={0}
                y1={-200}
                x2={0}
                y2={-240}
                stroke={SABOR[sabor]}
                strokeWidth={4}
                opacity={0.5 + 0.5 * glow}
              />
            </g>
          );
        })}
      </g>
      <path d={BOTON} fill="none" stroke="#E87890" strokeWidth={6} />
      <ellipse cx={0} cy={-250} rx={30} ry={12} fill={C.bg} />
    </g>
  );
};

// Icono de cada sabor
export const IconoSabor: React.FC<{
  readonly sabor: Sabor;
  readonly x: number;
  readonly y: number;
  readonly op: number;
  readonly s?: number;
}> = ({ sabor, x, y, op, s = 1 }) => {
  const c = SABOR[sabor];
  let figura: React.ReactNode = null;
  if (sabor === "dulce") {
    figura = (
      <g>
        <path
          d="M -70 -30 L -40 0 L -70 30 Z M 70 -30 L 40 0 L 70 30 Z"
          fill={c}
        />
        <circle r={42} fill={c} />
        <path
          d="M -20 -20 Q 0 0 -20 20 M 0 -30 Q 20 0 0 30"
          stroke="#FFFFFF"
          strokeWidth={6}
          fill="none"
          opacity={0.7}
        />
      </g>
    );
  } else if (sabor === "salado") {
    figura = (
      <g>
        <path d="M -36 -20 Q 0 -70 36 -20 Z" fill="#C8C4D8" />
        <rect x={-40} y={-22} width={80} height={80} rx={12} fill={c} />
        {[-14, 0, 14].map((d) => (
          <circle key={d} cx={d} cy={-36} r={4} fill={C.bg} />
        ))}
      </g>
    );
  } else if (sabor === "acido") {
    figura = (
      <g>
        <ellipse rx={60} ry={42} fill={c} />
        <ellipse cx={-62} rx={10} ry={8} fill={c} />
        <ellipse cx={62} rx={10} ry={8} fill={c} />
      </g>
    );
  } else if (sabor === "amargo") {
    figura = (
      <g>
        <path d="M -46 -30 L 46 -30 L 38 44 Q 0 56 -38 44 Z" fill={c} />
        <path
          d="M 46 -16 Q 76 -10 66 16 Q 58 30 42 26"
          stroke={c}
          strokeWidth={8}
          fill="none"
        />
        <ellipse cx={0} cy={-30} rx={46} ry={10} fill="#5A3020" />
      </g>
    );
  } else {
    figura = (
      <g>
        <path d="M -60 40 L 60 40 L 60 -10 L -60 -40 Z" fill={c} />
        <circle cx={-20} cy={10} r={10} fill="#6A3E98" />
        <circle cx={26} cy={18} r={7} fill="#6A3E98" />
        <circle cx={30} cy={-8} r={6} fill="#6A3E98" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      {figura}
      <text
        y={110}
        textAnchor="middle"
        fill={c}
        fontFamily={mono}
        fontSize={30}
        fontWeight={700}
      >
        {sabor === "acido" ? "ácido" : sabor}
      </text>
    </g>
  );
};
